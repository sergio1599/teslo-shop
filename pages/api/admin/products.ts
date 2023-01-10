import type { NextApiRequest, NextApiResponse } from 'next'
import { database } from '../../../database';
import { Iproduct } from '../../../interfaces';
import { Product } from '../../../models';

type Data =
    | { message: string }
    | Iproduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProducts(req, res);

        case 'PUT':

            break;
        case 'POST':

            break;

        default:
            return res.status(400).json({ message: 'Bad Request' })
    }



}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await database.connect();

    const products = await Product.find()
        .sort({ title: 'asc' })
        .lean();

    await database.disconnect();

    /* Tengo que actualizar las imágenes */

    res.status(200).json(products);
}
