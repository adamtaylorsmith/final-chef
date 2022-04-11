import { createTheme } from '@mui/material/styles';
import { useContext, useEffect, useState } from 'react';
import {
  AppBar,
  Badge,
  Box,
  Container,
  CssBaseline,
  Link,
  ThemeProvider,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import classes from '../utils/classes';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import { Store } from '../utils/Store';
// import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import jsCookie from 'js-cookie';
import axios from 'axios';
// import { useSnackbar } from 'notistack';
// import { getError } from '../utils/error';


export default function Layout({ title, description, children }) {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const { darkMode, cart, userInfo } = state; // userInfo
  const theme = createTheme({
    components: {
      MuiLink: {
        defaultProps: {
          underline: 'hover',
        },
      },
    },
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    jsCookie.remove('userInfo');
    jsCookie.remove('cartItems');
    jsCookie.remove('shippingAddress');
    jsCookie.remove('paymentMethod');
    router.push('/');
  };

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  // const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        console.log(err)
        // enqueueSnackbar(getError(err), { variant: 'error' });
      }
    };
    fetchCategories();
  }, []);

  const isDesktop = useMediaQuery('(min-width:600px)');

  const [query, setQuery] = useState('');
  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <>
      <Head>
        <title>{title ? `${title} - Chef Adam` : 'Chef Adam'}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" sx={classes.appbar}>
          <Toolbar sx={classes.toolbar}>
            <Box display="flex" alignItems="center">
            <IconButton
                  edge="start"
                  aria-label="open drawer"
                  onClick={sidebarOpenHandler}
                  sx={classes.menuButton}
                >
                  <MenuIcon sx={classes.navbarButton} />
                </IconButton>
              <NextLink href="/" passHref>
                <Link>
                  <Typography sx={classes.brand}>Chef Adam</Typography>
                </Link>
              </NextLink>
            </Box>
            <Drawer
              anchor="left"
              open={sidebarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography>Shopping by category</Typography>
                    <IconButton
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {categories.map((category) => (
                  <NextLink
                    key={category}
                    href={`/search?category=${category}`}
                    passHref
                  >
                    <ListItem
                      button
                      component="a"
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={category}></ListItemText>
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </Drawer>
            <Box sx={isDesktop ? classes.visible : classes.hidden}>
              <form onSubmit={submitHandler}>
                <Box sx={classes.searchForm}>
                  <InputBase
                    name="query"
                    sx={classes.searchInput}
                    placeholder="Search products"
                    onChange={queryChangeHandler}
                  />
                  <IconButton
                    type="submit"
                    sx={classes.searchButton}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </Box>
              </form>
            </Box>
            <Box>
              <NextLink href="/cart" passHref>
                <Link>
                  <Typography component="span">
                    {cart.cartItems.length > 0 ? (
                      <Badge
                        color="secondary"
                        badgeContent={cart.cartItems.length}
                      >
                        Cart&nbsp;
                      </Badge>
                    ) : (
                      'Cart'
                    )}
                  </Typography>
                </Link>
              </NextLink>
              {userInfo? (
                <>
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  sx={classes.navbarButton}
                  onClick={loginClickHandler}
                >
                  {userInfo.name}
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={loginMenuCloseHandler}
                >
                  <MenuItem
                    onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, '/order-history')
                      }
                    >
                      Order History
                    </MenuItem>
                  <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                </Menu>
              </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>
                    &nbsp;Login
                  </Link>
                </NextLink>
              )}
            </Box>

          </Toolbar>
        </AppBar>
        <Container component="main" sx={classes.main}>
          {children}
        </Container>
        <Box component="footer" sx={classes.footer}>
          <Typography>Chef Adam Taylor 2022</Typography>
        </Box>
      </ThemeProvider>
    </>
  );
}