import mongoose, { Schema, model, Model } from 'mongoose';
import { Iproduct } from '../interfaces';

const productSchema = new Schema({
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    inStock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    size: [{
        type: String,
        enum: {
            values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            message: '{VALUE} no es un tamaño permitido'
        }
    }],
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    title: { type: String, required: true },
    type: [{
        type: String,
        enum: {
            values: ['shirts', 'pants', 'hoodies', 'hats'],
            message: '{VALUE} no es tipo de prenda permitido'
        }
    }],
    gender: [{
        type: String,
        enum: {
            values: ['men', 'women', 'kid', 'unisex'],
            message: '{VALUE} no es genero permitido'
        }
    }],
}, {
    timestamps: true
})

productSchema.index({ title: 'text', tags: 'text' });

const Product: Model<Iproduct> = mongoose.models.Product || model('Product', productSchema);

export default Product;