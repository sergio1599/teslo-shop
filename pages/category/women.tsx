import type { NextPage } from 'next';
import { useProducts } from '../../hooks';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { FullScreenLoading } from '../../components/ui';
import { ProductList } from '../../components/products';


const WomenPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=women');

  return (
    <ShopLayout
      title={'TesloShop - Mujeres'}
      pageDescription={'Encuentra los mejores productos para las mujeres'}
    >
      <Typography variant='h1' component='h1'>Mujeres</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos para mujeres</Typography>
      {
        isLoading
          ? <FullScreenLoading/>
          : <ProductList products={products} />
      }
    </ShopLayout>
  );
};

export default WomenPage;
