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

interface ProductSlug {
    slug: string;
}
export const getAllProductSlugs = async (): Promise<ProductSlug[]> => {
    await database.connect()
    const slugs = await Product.find().select('slug -_id').lean();
    await database.disconnect()

    return slugs;
}