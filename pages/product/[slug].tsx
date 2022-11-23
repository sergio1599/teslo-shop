import { useState, useContext } from 'react';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';

import { Box, Button, Chip, Grid, Typography } from '@mui/material';

import { CartContext } from '../../context';
import { ShopLayout } from '../../components/layouts';
import { ProductSlideShow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { ICartProduct, Iproduct, ISize } from '../../interfaces';

import { databaseProducts } from '../../database';

interface Props {
  product: Iproduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
  /* const { products: product, isLoading } = useProducts(
    `/products/${router.query.slug}`
  ); */

  const router = useRouter();

  const { addProductToCart } = useContext(CartContext);

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    images: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const selectedSize = (size: ISize) => {
    setTempCartProduct((currectProduct) => ({
      ...currectProduct,
      size,
    }));
  };

  const onUpdateQuantity = (quantity: number) => {
    setTempCartProduct((currectProduct) => ({
      ...currectProduct,
      quantity,
    }));
  };

  const onAddProduct = () => {
    if (!tempCartProduct.size) return;

    addProductToCart(tempCartProduct);
    /* console.log({ tempCartProduct }); */
    router.push('/cart');
  };

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
              sizes={product.sizes}
              selectedSize={tempCartProduct.size}
              onSelectedSize={selectedSize}
            />
            <Box sx={{ my: 2 }}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              <ItemCounter
                currentValue={tempCartProduct.quantity}
                updateQuantity={onUpdateQuantity}
                maxValue={product.inStock}
              />
            </Box>
            {/* Agregar al carrito */}

            {product.inStock > 0 ? (
              <>
                {tempCartProduct.size ? (
                  <Button
                    color='secondary'
                    className='circular-btn'
                    onClick={onAddProduct}
                  >
                    Agregar al carrito
                  </Button>
                ) : (
                  <Chip
                    label='Seleccione una talla'
                    color='secondary'
                    variant='outlined'
                  />
                )}
              </>
            ) : (
              <Chip
                label='No hay disponibles'
                color='error'
                variant='outlined'
              />
            )}

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

/* Hacer getStaticPaths blocking
y getStaticProps y revalidar cada 24 horas */

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const productSlug = await databaseProducts.getAllProductSlugs();

  return {
    paths: productSlug.map(({ slug }) => ({
      params: { slug },
    })),
    fallback: 'blocking',
  };
};

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = '' } = params as { slug: string }; // your fetch function here

  const product = await databaseProducts.getProductBySlug(slug);

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
    revalidate: 86400,
  };
};

/* export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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
 */
export default ProductPage;
