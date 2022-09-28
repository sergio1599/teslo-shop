import type { NextPage, GetServerSideProps } from 'next';
import { ShopLayout } from '../../components/layouts';
import { Typography } from '@mui/material';
import { ProductList } from '../../components/products';
import { databaseProducts } from '../../database';
import { Iproduct } from '../../interfaces';

interface Props {
  products: Iproduct[];
}

const SearchPage: NextPage<Props> = ({ products }) => {
  return (
    <ShopLayout
      title={'TesloShop - Buscar'}
      pageDescription={'Encuentra los mejores productos aquí'}
    >
      <Typography variant='h1' component='h1'>
        Buscar producto
      </Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>
        ABC---123
      </Typography>
      <ProductList products={products} />
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = '' } = params as { query: string }; // your fetch function here

  if (query.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  let products = await databaseProducts.getProductsByTerm(query);
  /* TODO: Retornar otros productos */

  return {
    props: {
      products,
    },
  };
};

export default SearchPage;
