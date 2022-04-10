import React, {useContext, useEffect} from 'react'
import Layout from '../components/Layout'
import { useForm, Controller } from 'react-hook-form'
import Form from '../components/Form'
import NextLink from 'next/link'
import { TextField, Typography, List, ListItem, Button, Link } from '@mui/material';
import axios from 'axios';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import {Store} from '../utils/Store'

export default function RegisterScreen() {
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const router = useRouter();
    // const { redirect } = router.query;

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

    const submitHandler = async ({ name, email, password, confirmPassword }) => {
        if (password !== confirmPassword) {
            alert("Passwords don't match")
        //   enqueueSnackbar("Passwords don't match", { variant: 'error' });
          return;
        }
        try {
          const { data } = await axios.post('/api/users/register', {
            name, email, password,
          });
          dispatch({ type: 'USER_LOGIN', payload: data });
          jsCookie.set('userInfo', JSON.stringify(data));
          router.push('/');
        } catch (err) {
            alert('REGISTRATION ERROR')
        //   enqueueSnackbar(getError(err), { variant: 'error' });
        }
    };

    return (
        <Layout title="Register">
            <Form onSubmit={handleSubmit(submitHandler)}>
                <Typography component="h1" variant="h1">
                    Register
                </Typography>
                <List>
                    <ListItem>
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            rules={{required: true, minLength: 3}}
                            render={ ({field}) => (
                                <TextField variant="outlined" 
                                    fullWidth id="name" 
                                    label="Name" 
                                    inputProps={{type: 'name'}} 
                                    error={Boolean(errors.name)}
                                    helperText={
                                        errors.name
                                        ? errors.name.type === 'pattern'
                                            ? 'Name length minimum 3 characters'
                                            : 'Name is required'
                                        : ''
                                    }
                                    {...field}
                                ></TextField>      
                            )}
                        ></Controller>
                    </ListItem>
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
                            rules={{required: true, minLength: 6}}
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
                        <Controller
                            name="confirmPassword"
                            control={control}
                            defaultValue=""
                            rules={{required: true, minLength: 6}}
                            render={ ({field}) => (
                                <TextField variant="outlined" 
                                    fullWidth id="confirmPassword" 
                                    label="Confirm Password" 
                                    inputProps={{type: 'password'}} 
                                    error={Boolean(errors.confirmPassword)}
                                    helperText={
                                        errors.confirmPassword
                                        ? errors.confirmPassword.type === 'minLength'
                                            ? 'Confirm Password length 6 characters minimum'
                                            : 'Confirm Password is required'
                                        : ''
                                    }
                                    {...field}
                                ></TextField>      
                            )}
                        ></Controller>
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" type="submit" fullWidth color="primary">
                            Register
                        </Button>
                    </ListItem>
                    <ListItem>
                        Already have an account?&nbsp; {''}
                        <NextLink href={'/login'} passHref>
                            <Link>
                                Login
                            </Link>
                        </NextLink>
                    </ListItem>
                </List>
            </Form>
        </Layout>
    )
}