import { IOrder } from './../../../interfaces/order';
import type { NextApiRequest, NextApiResponse } from 'next'
import { database } from '../../../database';
import { Order } from '../../../models';

type Data =
    | { message: string }
    | IOrder[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getOrders(req, res);
        default:
            return res.status(400).json({ message: 'Bad request' })

    }

}

const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await database.connect();
    const orders = await Order.find()
        .sort({ createdAt: 'descending' })
        .populate('user', 'name email')
        .lean();
    await database.disconnect();

    return res.status(200).json(orders);
}
