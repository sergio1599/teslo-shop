import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import { database } from '../../../database';
import { IPaypal } from '../../../interfaces';
import { Order } from '../../../models';

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return payOrder(req, res);

        default:
            return res.status(400).json({ message: 'Bad Request' })
    }

}

const getPaypalBearerToken = async (): Promise<string | null> => {

    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64');
    const body = new URLSearchParams('grant_type=client_credentials');

    try {
        const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${base64Token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return data.access_token;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.response?.data);
        } else {
            console.log(error);
        }
        return null;
    }

}


const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    /* TODO: validar la sesión del usuario */
    /* TODO: validar mongoId */

    /* Obtengo el token de verificación desdde mi back */
    const paypalBearerToken = await getPaypalBearerToken();

    if (!paypalBearerToken) {
        return res.status(400).json({ message: 'No se pudo confirmar el token de paypal' })
    }


    const { transactionId = '', orderId = '' } = req.body;

    /* Hago pa petición a paypal para saber si la orden ya está pagada */
    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`, {
        headers: {
            'Authorization': `Bearer ${paypalBearerToken}`
        }
    });

    /* Si no está pagada */
    if (data.status !== 'COMPLETED') {
        return res.status(401).json({ message: 'Orden no reconocida' });
    }

    /* Si está como pagada me conecto a la base de datos y busco la orden por el Id */
    await database.connect();
    const dbOrder = await Order.findById(orderId);

    /* Si no existe una orden */
    if (!dbOrder) {
        await database.disconnect();
        return res.status(400).json({ message: 'Orden no exsite en nuestra base de datos' });
    }

    /* Si los montos no son iguales */
    if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
        await database.disconnect();
        return res.status(400).json({ message: 'Los montos de Paypal y nuestra orden no coinciden' });
    }

    dbOrder.transctionId = transactionId;
    dbOrder.isPaid = true;
    await dbOrder.save()

    await database.disconnect();

    return res.status(200).json({ message: 'Orden pagada' })
}