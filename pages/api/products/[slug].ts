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

    const getProduct = await Product.findOne({ slug }).lean();

    if (!getProduct) {
        await database.disconnect();
        return res.status(400).json({ message: 'No se ha encontrado el producto' + slug })
    }
    return res.status(200).json(getProduct);
}
