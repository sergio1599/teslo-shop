import { isValidObjectId } from 'mongoose';
import { Iproduct } from '../interfaces';
import { Product } from '../models';
import { database } from './';

export const getProductBySlug = async (slug: string): Promise<Iproduct | null> => {

    if (!isValidObjectId) return null;

    await database.connect();
    const product = await Product.findOne({ slug }).lean();
    console.log(product)
    await database.disconnect();

    if (!product) {
        return null;
    }

    return JSON.parse(JSON.stringify(product));
}