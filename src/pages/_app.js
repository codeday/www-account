import React from 'react';
import { ThemeProvider } from '@codeday/topo/Theme';

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider brandColor="red" cookies={pageProps.cookies}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
