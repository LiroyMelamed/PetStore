import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './i18n';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme.js';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import "./styles/global.scss";
import "./styles/_responsive.scss";
import i18n from './i18n.js';

// Create emotion cache with RTL support for Hebrew
const createEmotionCache = (isRtl) => {
  if (isRtl) {
    return createCache({
      key: 'muirtl',
      stylisPlugins: [prefixer, rtlPlugin],
    });
  }
  return createCache({ key: 'mui' });
};

const root = ReactDOM.createRoot(document.getElementById('root'));

// Initial state: set text direction based on language
const setupDirection = () => {
  const lang = localStorage.getItem('i18nextLng') || 'en';
  const isRtl = lang === 'he';

  document.documentElement.lang = lang;
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.body.dir = isRtl ? 'rtl' : 'ltr';

  return isRtl;
};

const isRtl = setupDirection();
const cacheRtl = createEmotionCache(isRtl);

// Update direction when language changes
i18n.on('languageChanged', (lng) => {
  const newIsRtl = lng === 'he';
  document.documentElement.dir = newIsRtl ? 'rtl' : 'ltr';
  document.body.dir = newIsRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

root.render(
  <React.StrictMode>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
);
