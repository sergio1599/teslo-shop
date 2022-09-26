import type { NextPage } from 'next';
import { useProducts } from '../../hooks';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { FullScreenLoading } from '../../components/ui';
import { ProductList } from '../../components/products';


const KidPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=kid');

  return (
    <ShopLayout
      title={'TesloShop - Niños'}
      pageDescription={'Encuentra los mejores productos para niños'}
    >
      <Typography variant='h1' component='h1'>Niños</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos para niños</Typography>
      {
        isLoading
          ? <FullScreenLoading/>
          : <ProductList products={products} />
      }
    </ShopLayout>
  );
};

export default KidPage;
