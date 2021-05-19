import '../styles/globals.scss';

import { AppProps } from 'next/app';
import Header from '../components/Header';

import styles from '../styles/common.module.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}

export default MyApp;
