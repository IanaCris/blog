import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }) {
  console.log(postsPagination);
  return (
    <>
      <Head>
        <title>Home - Blog</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <Link href={`/post/como-utilizar-hooks-teste`}>
            <a key="como-utilizar-hooks">
              <strong>Como utilizar Hooks</strong>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <div className={styles.info}>
                <time>15 Mar 2021</time>
                <p>Iana Sousa</p>
              </div>
            </a>
          </Link>
          <Link href={`/post/como-utilizar-hooks-teste`}>
            <a key="como-utilizar-hooks">
              <strong>Como utilizar Hooks</strong>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <div className={styles.info}>
                <time>15 Mar 2021</time>
                <p>Iana Sousa</p>
              </div>
            </a>
          </Link>
          <Link href={`/post/como-utilizar-hooks-teste`}>
            <a key="como-utilizar-hooks">
              <strong>Como utilizar Hooks</strong>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <div className={styles.info}>
                <time>15 Mar 2021</time>
                <p>Iana Sousa</p>
              </div>
            </a>
          </Link>
          <Link href={`/post/como-utilizar-hooks-teste`}>
            <a key="como-utilizar-hooks">
              <strong>Como utilizar Hooks</strong>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <div className={styles.info}>
                <time>15 Mar 2021</time>
                <p>Iana Sousa</p>
              </div>
            </a>
          </Link>
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['posts.title', 'posts.content'],
    pageSize: 20,
  })

  const postsPagination = response.results.map(post => {
    return {
      slug: post.uid,
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    };
  });

  //console.log(JSON.stringify(response, null, 2));

  return {
    props: {
      postsPagination
    }
  }
};
