import NextLink from 'next/link';
import { Chip, Grid, Link, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';


const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Nombre Completo', width: 300 },

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
        <NextLink href={`/orders/${params.row.id}`} passHref>
          <Link underline='always'>Orden</Link>
        </NextLink>
      );
    },
  },
];

const rows = [
  { id: 1, paid: true, fullname: 'Sergio Quintana' },
  { id: 2, paid: false, fullname: 'Daniel Lagos' },
  { id: 3, paid: true, fullname: 'Jahir Fiquitiva' },
  { id: 4, paid: false, fullname: 'Arge Niño' },
  { id: 5, paid: true, fullname: 'Sebastian Rivas' },
];

const HistoryPage = () => {
  return (
    <ShopLayout
      title={'Historial de ordenes'}
      pageDescription={'Historial de ordenes del cliente'}
    >
      <Typography variant='h1' component='h1'>
        Historial de Ordenes
      </Typography>
      <Grid container>
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

export default HistoryPage;
