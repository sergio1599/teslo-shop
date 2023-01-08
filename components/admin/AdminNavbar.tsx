import { useContext } from 'react';
import NextLink from 'next/link';
import { UiContext } from '../../context';

import { AppBar, Button, Link, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';

export const AdminNavbar = () => {
  const { toogleSideMenu } = useContext(UiContext);

  return (
    <AppBar>
      <Toolbar>
        <NextLink href='/' passHref>
          <Link display='flex' alignItems='center'>
            <Typography variant='h6'>Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>
        <Box flex={1} />

        <Button onClick={toogleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
