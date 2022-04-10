import '../styles/globals.css';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { StoreProvider } from '../utils/Store';
// import { SnackbarProvider } from 'notistack';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const clientSideEmotionCache = createCache({ key: 'css' });

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}) {
  return (
    <CacheProvider value={emotionCache}>
      <StoreProvider>
      {/* <SnackbarProvider
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >*/}
          <PayPalScriptProvider deferLoading={true}> 
            <Component {...pageProps} />
           </PayPalScriptProvider>
      {/*</SnackbarProvider> */}
      </StoreProvider>
    </CacheProvider>
  );
}

export default MyApp;
