import React, {useEffect, useContext} from 'react'
import Layout from '../components/Layout'
import { useForm, Controller } from 'react-hook-form'
import Form from '../components/Form'
import NextLink from 'next/link'
import { TextField, Typography, List, ListItem, Button, Link } from '@mui/material';
import axios from 'axios'
import jsCookie from 'js-cookie'
import { useRouter } from 'next/router';
import { Store } from '../utils/Store'

export default function LoginScreen() {
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const router = useRouter();
    useEffect(() => {
        if (userInfo) {
        router.push('/');
        }
    }, [router, userInfo]);
    const {
        handleSubmit,
        control,
        formState: {errors},
    } = useForm();

    const submitHandler = async ({ email, password }) => {
        try {
          const { data } = await axios.post('/api/users/login', {
            email,
            password,
          });
          dispatch({ type: 'USER_LOGIN', payload: data });
          jsCookie.set('userInfo', JSON.stringify(data));
          router.push('/');
        } catch (err) {
            alert('Error no login sorry')
        //   enqueueSnackbar(err.message, { variant: 'error' });
        }
      };

    return (
        <Layout title="Login">
            <Form onSubmit={handleSubmit(submitHandler)}>
                <Typography component="h1" variant="h1">
                    Login
                </Typography>
                <List>
                    <ListItem>
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true, 
                                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                            }}
                            render={ ({field}) => (
                                <TextField variant="outlined" 
                                    fullWidth id="email" 
                                    label="Email" 
                                    inputProps={{type: 'email'}} 
                                    error={Boolean(errors.email)}
                                    helperText={
                                        errors.email
                                        ? errors.email.type === 'pattern'
                                            ? 'Email is not valid'
                                            : 'Email is required'
                                        : ''
                                    }
                                    {...field}
                                ></TextField>      
                            )}
                        ></Controller>
                    </ListItem>
                    <ListItem>
                        <Controller
                            name="password"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true, 
                                minLength: 6
                            }}
                            render={ ({field}) => (
                                <TextField variant="outlined" 
                                    fullWidth id="password" 
                                    label="Password" 
                                    inputProps={{type: 'password'}} 
                                    error={Boolean(errors.password)}
                                    helperText={
                                        errors.password
                                        ? errors.password.type === 'minLength'
                                            ? 'Password length 6 characters minimum'
                                            : 'Password is required'
                                        : ''
                                    }
                                    {...field}
                                ></TextField>      
                            )}
                        ></Controller>
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" type="submit" fullWidth color="primary">
                            Login
                        </Button>
                    </ListItem>
                    <ListItem>
                        Do not have an account?&nbsp; {''}
                        <NextLink href={'/register'} passHref>
                            <Link>
                                Register
                            </Link>
                        </NextLink>
                    </ListItem>
                </List>
            </Form>
        </Layout>
    )
}