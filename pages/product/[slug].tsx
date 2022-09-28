import React, { FC } from 'react';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductSlideShow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { Iproduct } from '../../interfaces';
import { NextPage, GetServerSideProps } from 'next';
import { databaseProducts } from '../../database';

interface Props {
  product: Iproduct;
}

const ProductPage: FC<Props> = ({ product }) => {
  /* const { products: product, isLoading } = useProducts(
    `/products/${router.query.slug}`
  ); */

  console.log(product.sizes);

  return (
    <ShopLayout title={product.title} pageDescription={product.title}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideShow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>
            {/* Title */}
            <Typography variant='h1' component='h1'>
              {product.title}
            </Typography>
            <Typography variant='subtitle1' component='h1'>
              ${product.price}
            </Typography>
            <SizeSelector
              //selectedSize={product.sizes[2]}
              sizes={product.sizes}
            />
            <Box sx={{ my: 2 }}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              <ItemCounter />
            </Box>
            {/* Agregar al carrito */}
            <Button color='secondary' className='circular-btn'>
              Agregar al carrito
            </Button>

            {/* <Chip label='No hay disponibles' color='error' variant='outlined' /> */}

            {/* Descripción */}
            <Box sx={{ mt: 3 }}>
              <Typography variant='subtitle2'>Descripción</Typography>
              <Typography variant='body2'>{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

/* GetServerSideProps */
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug = '' } = params as { slug: string };
  const product = await databaseProducts.getProductBySlug(slug); // your fetch function here

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
  };
};

export default ProductPage;
