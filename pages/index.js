import { Typography } from '@mui/material'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <Head>
        <title></title>
        <meta name="yes" description="oh yes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Typography component="h1" variant="h1">Please Help</Typography>
    </div>
  )
}
