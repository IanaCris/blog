import { GetStaticProps } from 'next';
import Head from 'next/head';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import Header from '../components/Header';

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

export default function Home({ postsPagination }: HomeProps) {
  //console.log(postsPagination);
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPost, setNextPost] = useState('');

  useEffect(() => {
    setPosts(postsPagination.results);
    setNextPost(postsPagination.next_page);
  }, [postsPagination.results, postsPagination.next_page]);

  function handleNextPost(): void {
    fetch(nextPost)
      .then(res => res.json())
      .then(data => {
        const formattedData = data.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: post.first_publication_date,
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
          };
        });

        setPosts([...posts, ...formattedData]);
        setNextPost(data.next_page);
      });
  }

  return (
    <>
      <Head>
        <title>Home - Blog</title>
      </Head>

      <Header />

      <main className={styles.container}>
        <div className={styles.content}>
          { posts.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <div className={styles.info}>
                  <div className={styles.createdAt}>
                    <FiCalendar />
                    <time>
                      {format(new Date(post.first_publication_date), 'PP', {
                        locale: ptBR,
                      })}
                    </time>
                  </div>

                  <div className={styles.author}>
                    <FiUser />
                    <p>{post.data.author}</p>
                  </div>
                </div>
              </a>
            </Link>
          )) }

          {nextPost && (
            <button type="button" className={styles.button} onClick={handleNextPost}>
              Carregar mais posts
            </button>
          )}
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
    fetch: ['post.title', 'post.subtitle', 'post.author'],
    pageSize: 2,
  })

  const results = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  //console.log(JSON.stringify(results, null, 2));

  return {
    props: {
      postsPagination: {
        next_page: response.next_page,
        results
      }
    }
  }
};
