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

export default function Home({posts}) {
  console.log(posts);
  return (
    <>
      <Head>
        <title>Home - Blog</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <Link href={`/posts/como-utilizar-hooks`}>
            <a key="como-utilizar-hooks">
              <time>15 Mar 2021</time>
              <strong>Como utilizar Hooks</strong>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
            </a>
          </Link>
        </div>
      </main>
    </>
  )
}
/*
export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
      Prismic.predicates.at('document.type', 'posts')
    ], {
      fetch: ['posts.title', 'posts.content'],
      pageSize: 20,
    }
  );

  console.log(postsResponse);

  const posts = postsResponse.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
    };
  });

  return {
    props: {
      posts
    }
  }
}; */
