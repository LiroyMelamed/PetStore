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

// פונקציה ליצירת cache עם תמיכה ב-RTL, תלוי בשפה
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

// מצב ראשוני: קבע את כיוון הטקסט על פי השפה הנוכחית
const isRtl = localStorage.getItem('i18nextLng') === 'he';
const cacheRtl = createEmotionCache(isRtl);

root.render(
  <React.StrictMode>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>,
);