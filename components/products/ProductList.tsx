import { Grid } from '@mui/material';
import { FC } from 'react';
import { Iproduct } from '../../interfaces';
import { ProductCard } from './ProductCard';

interface Props {
  products: Iproduct[];
}

export const ProductList: FC<Props> = ({ products }) => {
    return (
        <Grid container spacing={4}>
            {
                products.map(product=>(
                    <ProductCard key={product.slug} product={product}/>
                ))
            }
        </Grid>
      )
};
