import type { NextPage, GetServerSideProps } from 'next';
import { ShopLayout } from '../../components/layouts';
import { Box, Typography } from '@mui/material';
import { ProductList } from '../../components/products';
import { databaseProducts } from '../../database';
import { Iproduct } from '../../interfaces';

interface Props {
  products: Iproduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  return (
    <ShopLayout
      title={'TesloShop - Buscar'}
      pageDescription={'Encuentra los mejores productos aquí'}
    >
      <Typography variant='h1' component='h1'>
        Buscar producto
      </Typography>
      {foundProducts ? (
        <Typography textTransform='capitalize' variant='h2' sx={{ mb: 1 }}>
          Termino: {query}
        </Typography>
      ) : (
        <Box display='flex'>
          <Typography variant='h2' sx={{ mb: 1 }}>
            No encontramos ningún producto
          </Typography>
          <Typography
            variant='h2'
            sx={{ ml: 1 }}
            color='secondary'
            textTransform='capitalize'
          >
            {query}
          </Typography>
        </Box>
      )}

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
  const foundProducts = products.length > 0;
  /* TODO: Retornar otros productos */
  if (!foundProducts) {
    /* products = await databaseProducts.getAllProducts(); */
    products = await databaseProducts.getProductsByTerm('cybertruck');
  }

  return {
    props: {
      products,
      foundProducts,
      query,
    },
  };
};

export default SearchPage;
