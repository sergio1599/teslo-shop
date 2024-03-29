import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { Box } from '@mui/system';
import { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';

import { ShopLayout } from '../../components/layouts/';
import { countries } from '../../utils';
import Cookies from 'js-cookie';
import { IShippingAddress } from '../../interfaces';
import { CartContext } from '../../context';

const AddressPage = () => {
  const { updateAddress } = useContext(CartContext);

  const router = useRouter();

  const getAddressFromCookies = (): IShippingAddress => {
    /* const cartCookieData = JSON.parse(Cookie.get('addressData')!); */
    return {
      firstName: Cookies.get('firstName') || '',
      lastName: Cookies.get('lastName') || '',
      address: Cookies.get('address') || '',
      address2: Cookies.get('address2') || '',
      zip: Cookies.get('zip') || '',
      city: Cookies.get('city') || '',
      country: Cookies.get('country') || '',
      phone: Cookies.get('phone') || '',
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IShippingAddress>({
    defaultValues: {
      firstName: '',
      lastName: '',
      address: '',
      address2: '',
      zip: '',
      city: '',
      country: countries[0].code,
      phone: '',
    },
  });

  useEffect(() => {
    reset(getAddressFromCookies());
  }, [reset]);

  const onSubmitAddress = async (data: IShippingAddress) => {
    updateAddress(data);
    router.push('/checkout/summary');
  };

  return (
    <ShopLayout
      title={'Direccion'}
      pageDescription={'Confirmar dirección de destino'}
    >
      <Typography variant='h1' component='h1'>
        Dirección
      </Typography>
      <form onSubmit={handleSubmit(onSubmitAddress)}>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Nombre'
              variant='filled'
              fullWidth
              {...register('firstName', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Apellido'
              variant='filled'
              fullWidth
              {...register('lastName', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Dirección'
              variant='filled'
              fullWidth
              {...register('address', {
                required: 'Este campo es requerido',
                minLength: { value: 10, message: 'Mínimo 10 caracteres' },
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Dirección 2 (opcional)'
              variant='filled'
              fullWidth
              {...register('address2')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Código postal'
              variant='filled'
              fullWidth
              {...register('zip', {
                required: 'Este campo es requerido',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              })}
              error={!!errors.zip}
              helperText={errors.zip?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type='text'
              label='Ciudad'
              variant='filled'
              fullWidth
              {...register('city', {
                required: 'Este campo es requerido',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
              })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* <FormControl fullWidth> */}
            <TextField
              //select
              type='text'
              variant='filled'
              label='País'
              fullWidth
              //defaultValue={Cookies.get('country') || countries[0].code}
              {...register('country', {
                required: 'Este campo es requerido',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
              })}
              error={!!errors.country}
              helperText={errors.country?.message}
            >
              {/* {countries.map((country) => (
                <MenuItem key={country.code} value={country.code}>
                  {country.name}
                </MenuItem>
              ))} */}
            </TextField>
            {/* </FormControl> */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type='tel'
              label='Teléfono'
              variant='filled'
              fullWidth
              {...register('phone', {
                required: 'Este campo es requerido',
                minLength: { value: 10, message: 'Mínimo 10 caracteres' },
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
          <Button
            type='submit'
            color='secondary'
            className='circular-btn'
            size='large'
          >
            Revisar pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

/* export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token = '' } = req.cookies;
  let isValidToken = false;
  try {
    await jwt.isValidToken(token);
    isValidToken = true;
  } catch (error) {
    isValidToken = false;
  }

  if (!isValidToken) {
    return {
      redirect: {
        destination: '/auth/login?p=/checkout/address',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}; */

export default AddressPage;
