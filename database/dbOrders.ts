import { IOrder } from "../interfaces";
import { isValidObjectId } from 'mongoose';
import { database } from ".";
import Order from '../models/Order';

export const getOrderById = async (id: string): Promise<IOrder | null> => {
    if (!isValidObjectId(id)) {
        return null;
    }

    await database.connect();
    const order = await Order.findById(id).lean();
    await database.disconnect();

    if (!order) {
        return null;
    }

    return JSON.parse(JSON.stringify(order));
}