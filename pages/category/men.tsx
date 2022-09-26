import type { NextPage } from 'next';
import { useProducts } from '../../hooks';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { FullScreenLoading } from '../../components/ui';
import { ProductList } from '../../components/products';


const MenPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=men');

  return (
    <ShopLayout
      title={'TesloShop - Hombres'}
      pageDescription={'Encuentra los mejores productos para hombres'}
    >
      <Typography variant='h1' component='h1'>Hombres</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos para hombres</Typography>
      {
        isLoading
          ? <FullScreenLoading/>
          : <ProductList products={products} />
      }
    </ShopLayout>
  );
};

export default MenPage;
