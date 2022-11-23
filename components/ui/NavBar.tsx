import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { UiContext, CartContext } from '../../context';

import {
  ClearOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from '@mui/icons-material';
import {
  AppBar,
  Badge,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';

export const NavBar = () => {
  const { asPath, push } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchIsVisible, setSearchIsVisible] = useState(false);

  const { toogleSideMenu } = useContext(UiContext);

  const { numberOfItems } = useContext(CartContext);

  const activeLink = (href: string) => {
    return href === asPath ? 'inherit' : 'info';
  };

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    push(`/search/${searchTerm}`);
    setSearchTerm('');
  };

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
        <Box
          sx={{
            display: searchIsVisible ? 'none' : { xs: 'none', sm: 'block' },
          }}
          className='fadeIn'
        >
          <NextLink href='/category/men' passHref>
            <Link>
              <Button color={activeLink('/category/men')}>Hombres</Button>
            </Link>
          </NextLink>
          <NextLink href='/category/women' passHref>
            <Link>
              <Button color={activeLink('/category/women')}>Mujeres</Button>
            </Link>
          </NextLink>
          <NextLink href='/category/kid' passHref>
            <Link>
              <Button color={activeLink('/category/kid')}>Niños</Button>
            </Link>
          </NextLink>
        </Box>
        <Box flex={1} />
        {/* Pantallas grandes */}
        {/* <IconButton>
          <SearchOutlined />
        </IconButton> */}

        {searchIsVisible ? (
          <Input
            sx={{ display: { xs: 'none', sm: 'flex' } }}
            className='fadeIn'
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => (e.key === 'Enter' ? onSearchTerm() : null)}
            type='text'
            placeholder='Buscar...'
            endAdornment={
              <InputAdornment position='end'>
                <IconButton onClick={() => setSearchIsVisible(false)}>
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton
            sx={{ display: { xs: 'none', sm: 'flex' } }}
            onClick={() => setSearchIsVisible(true)}
            className='fadeIn'
          >
            <SearchOutlined />
          </IconButton>
        )}

        {/* Pantallas pequeñas */}
        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none' } }}
          onClick={toogleSideMenu}
        >
          <SearchOutlined />
        </IconButton>
        <NextLink href='/cart' passHref>
          <Link>
            <IconButton>
              <Badge
                badgeContent={numberOfItems > 9 ? '+9' : numberOfItems}
                color='secondary'
              >
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>
        <Button onClick={toogleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
