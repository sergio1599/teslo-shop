import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { getSession } from 'next-auth/react';
import { Chip, Grid, Link, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { databaseOrders } from '../../database';
import { IOrder } from '../../interfaces';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullName', headerName: 'Nombre Completo', width: 300 },

  {
    field: 'paid',
    headerName: 'Pagada',
    description: 'muestra Información si está pagada o no',
    width: 200,
    renderCell: (params: GridRenderCellParams) => {
      return params.row.paid ? (
        <Chip color='success' label='Pagada' variant='outlined' />
      ) : (
        <Chip color='error' label='No pagada' variant='outlined' />
      );
    },
  },

  {
    field: 'link',
    headerName: 'Ver orden',
    description: 'Link de la orden',
    width: 200,
    sortable: false,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <NextLink href={`/orders/${params.row.orderId}`} passHref>
          <Link underline='always'>Orden</Link>
        </NextLink>
      );
    },
  },
];

/* const rows = [
  { id: 1, paid: true, fullname: 'Sergio Quintana' },
  { id: 2, paid: false, fullname: 'Daniel Lagos' },
  { id: 3, paid: true, fullname: 'Jahir Fiquitiva' },
  { id: 4, paid: false, fullname: 'Arge Niño' },
  { id: 5, paid: true, fullname: 'Sebastian Rivas' },
]; */

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  console.log(orders);
  const rows = orders.map((order, idx) => ({
    id: idx + 1,
    paid: order.isPaid,
    fullName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    orderId: order._id,
  }));

  return (
    <ShopLayout
      title={'Historial de ordenes'}
      pageDescription={'Historial de ordenes del cliente'}
    >
      <Typography variant='h1' component='h1'>
        Historial de Ordenes
      </Typography>
      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?p=/orders/histoy',
        permanent: false,
      },
    };
  }

  const orders = await databaseOrders.getOrderByUser(session.user._id);

  return {
    props: {
      orders,
    },
  };
};

export default HistoryPage;
