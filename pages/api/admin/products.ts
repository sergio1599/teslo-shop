import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { v2 as cloudinary } from 'cloudinary'
cloudinary.config(process.env.CLOUDINARY_URL || '');
import { database } from '../../../database';
import { Iproduct } from '../../../interfaces';
import { Product } from '../../../models';

type Data =
    | { message: string }
    | Iproduct[]
    | Iproduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProducts(req, res);

        case 'PUT':
            return updateProducts(req, res);
        case 'POST':
            return createProduct(req, res);

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
    const updatedProducts = products.map(product => {
        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`
        });
        return product;
    })

    res.status(200).json(updatedProducts);
}
const updateProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { _id = '', images = [] } = req.body as Iproduct;

    if (!isValidObjectId(_id)) {
        return res.status(400).json({ message: 'El id del producto no es válido' });
    }

    if (images.length < 2) {
        return res.status(400).json({ message: 'Es necesario al menos 2 imágenes' });
    }

    /* posiblemente tendremos un localhost:3000/products/assaa.jpg */

    try {
        await database.connect();
        const product = await Product.findById(_id);
        if (!product) {
            await database.disconnect();
            return res.status(400).json({ message: 'No existe un produto con este ID' });
        }

        /* eliminar imágenes en Cloudinary */
        //https://res.cloudinary.com/dxasiwiyb/image/upload/v1673451886/ry9axumxglr4dqyvg4j5.webp
        product.images.forEach(async (image) => {
            if (!images.includes(image)) {
                const [fileId, extension] = image.substring(image.lastIndexOf('/') + 1).split('.');
                console.log({ image, fileId, extension });
                await cloudinary.uploader.destroy(fileId);
            }
        })

        await product.update(req.body);
        await database.disconnect();

        return res.status(200).json(product);

    } catch (error) {
        console.log(error)
        await database.disconnect();
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { images = [] } = req.body as Iproduct;

    if (images.length < 2) {
        return res.status(400).json({ message: 'el producto necesita al menos 2 imágenes' })
    }

    /* posiblemente tendremos un localhost:3000/products/assaa.jpg */

    try {
        await database.connect();
        const productInDB = await Product.findOne({ slug: req.body.slug });
        if (productInDB) {
            await database.disconnect();
            return res.status(400).json({ message: 'Ya existe un producto con ese slug' })
        }

        const product = new Product(req.body);
        await product.save();
        await database.disconnect();

        return res.status(201).json(product);


    } catch (error) {
        await database.disconnect();
        return res.status(400).json({ message: 'revisar logs del servidor' })
    }
}

