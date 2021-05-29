import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Head from 'next/head';

import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Header from '../../components/Header';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  //console.log(post);
  const router = useRouter();
  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Head>
        <title>{post.data.title} | Blog</title>
      </Head>

      <Header />

      <div className={styles.banner} />

      <main className={styles.container}>
        <div className={styles.content}>
          <p>{post.data.title}</p>
          <div className={styles.info}>
            <FiCalendar />
            <time>
              {format(new Date(post.first_publication_date), 'PP', {
                locale: ptBR,
              })}
            </time>
            <FiUser />
            <p>{post.data.author}</p>
            <FiClock />
            <p>4 min</p>
          </div>
        </div>
      </main>

    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    { pageSize: 3 }
  );

  const paths = posts.results.map(result => {
    return {
      params: {
        slug: result.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url ?? null,
      },
      author: response.data.author,
      content: response.data.content.map(item => ({
        heading: item.heading,
        body: [...item.body],
      })),
    },
    uid: response.uid,
  };

  console.log(JSON.stringify(post, null, 2));
  //console.log(JSON.stringify(response, null, 2));

  return {
    props: {
      post,
    }
  }
};
