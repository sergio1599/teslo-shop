import type { NextApiRequest, NextApiResponse } from 'next'
import { database } from '../../../database';
import { Product } from '../../../models';
import { Iproduct } from '../../../interfaces';
import mongoose from 'mongoose';

type Data =
    | { message: string }
    | Iproduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    /* const { slug } = req.query;


    if (!mongoose.isValidObjectId(slug)) {
        return res.status(400).json({ message: 'No se ha encontrado el producto' });
    } */

    switch (req.method) {
        case 'GET':
            return getProductBySlug(req, res);
        default:
            return res.status(400).json({ message: 'El método no existe' });
    }

}

const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await database.connect();
    const { slug } = req.query;
    const product = await Product.findOne({ slug }).lean();
    await database.disconnect();

    if (!product) {
        return res.status(400).json({ message: 'No se ha encontrado el producto' + slug })
    }
    product.images = product.images.map(image => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
    });
    return res.status(200).json(product);
}
