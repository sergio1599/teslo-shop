import type { NextApiRequest, NextApiResponse } from 'next'
import { database, seedDataBase } from '../../database'
import { Product, User, Order } from '../../models';

type Data = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (process.env.NODE_ENV === 'production') {
        return res.status(400).json({ message: 'No tiene acceso a este servicio' })
    }

    await database.connect();

    await User.deleteMany();
    await User.insertMany(seedDataBase.initialData.users);

    await Product.deleteMany();
    await Product.insertMany(seedDataBase.initialData.products);

    await Order.deleteMany();

    await database.disconnect();

    res.status(200).json({ message: 'Proceso de inserción de datos realizado con éxito' })


}