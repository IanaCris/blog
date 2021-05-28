import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { FaCalendar, FaUser } from 'react-icons/fa';

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
  //console.log(postsPagination);
  return (
    <>
      <Head>
        <title>Home - Blog</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          { postsPagination.map(post => (
            <Link href={`/post/${post.slug}`} key={post.slug}>
              <a>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
                <div className={styles.info}>
                  <div className={styles.createdAt}>
                    <FaCalendar />
                    <time>{post.updatedAt}</time>
                  </div>

                  <div className={styles.author}>
                    <FaUser />
                    <p>Iana Sousa</p>
                  </div>
                </div>
              </a>
            </Link>
          )) }
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
    pageSize: 2,
  })

  const nextPost = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: `${response.next_page}`,
      orderings: '[document.first_publication_date]',
    }
  );

  //console.log(JSON.stringify(nextPost, null, 2));

  const postsPagination = response.results.map(post => {
    return {
      slug: post.uid,
      title: post.data.title,
      excerpt: post.data.content[0].body.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    };
  });

  //console.log(JSON.stringify(postsPagination, null, 2));

  return {
    props: {
      postsPagination
    }
  }
};
