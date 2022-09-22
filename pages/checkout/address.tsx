import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ShopLayout } from '../../components/layouts/';


const AddressPage = () => {
  return (
    <ShopLayout title={'Direccion'} pageDescription={'Confirmar dirección de destino'}>
        <Typography variant='h1' component='h1'>Dirección</Typography>

        <Grid container spacing={2} sx={{mt:2}}>
            <Grid item xs={12} sm={6}>
                <TextField label='Nombre' variant='filled' fullWidth/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Apellido' variant='filled' fullWidth/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Código postal' variant='filled' fullWidth/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Ciudad' variant='filled' fullWidth/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <Select
                        variant='filled'
                        label='País'
                        value={1}
                    >
                        <MenuItem value={1}>Colombia</MenuItem>
                        <MenuItem value={2}>Venezuela</MenuItem>
                        <MenuItem value={3}>Ecuador</MenuItem>
                        <MenuItem value={4}>México</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label='Teléfono' variant='filled' fullWidth/>
            </Grid>
        </Grid>

        <Box sx={{mt:5}} display='flex' justifyContent='center'>
                <Button color='secondary' className='circular-btn' size='large'>
                    Revisar pedido
                </Button>
        </Box>
    </ShopLayout>
  )
}

export default AddressPage