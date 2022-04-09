import { CircularProgress, Typography, Alert, Grid } from '@mui/material';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import client from '../utils/client'

export default function Home() {
const [state, setState] = useState({
  products: [],
  error: '',
  loading: true
})
const {loading, error, products} = state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await client.fetch(`*[_type == "product"]`)
        setState({products, loading: false})
      } catch(err) {
        setState({loading: false, error: err.message})
      }
    }
    fetchData()
  }, [])

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
        alert('Sorry. Product is out of stock')
    //   enqueueSnackbar('Sorry. Product is out of stock', { variant: 'error' });
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        _key: product._id,
        name: product.name,
        countInStock: product.countInStock,
        slug: product.slug.current,
        price: product.price,
        image: urlForThumbnail(product.image),
        quantity,
      },
    });
    alert(`${product.name} added to the cart`)
    // enqueueSnackbar(`${product.name} added to the cart`, {
    //   variant: 'success',
    // });
    // router.push('/cart');
  };

  return <Layout>
    {loading? (<CircularProgress />)
    : error? (<Alert variant="danger">{error}</Alert>)
    : 
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item md={4} key={product.slug}>
            <ProductItem product={product}></ProductItem>
            <ProductItem
                product={product}
                addToCartHandler={addToCartHandler}
              ></ProductItem>
          </Grid>
        ))}
      </Grid>
    }
  </Layout>;
}