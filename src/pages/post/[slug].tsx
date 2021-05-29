import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Head from 'next/head';

import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Header from '../../components/Header';

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

export default function Post({ post }) {
  //console.log(post);
  return (
    <div className={commonStyles.wrapper}>
      <Head>
        <title>{post.title} | Blog</title>
      </Head>

      <Header />

      <div className={styles.content}>
        <p>Titulo da noticia</p>
        <div className={styles.info}>
          <FiCalendar />
          <p>15 mar 2021</p>
          <FiUser />
          <p>Iana Sousa</p>
          <FiUser />
          <p>Iana Sousa</p>
        </div>
      </div>

    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  /* const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: [], //'posts.title', 'posts.content'
    pageSize: 1,
  });

  //console.log(posts);
  console.log(JSON.stringify(posts, null, 2)); */

  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    slug,
    title: response.data.title,
    author: response.data.author,
    //content: RichText.asHtml(response.data.content),
    updatedAt: format(
      new Date(response.last_publication_date),
      "PP",
      {
        locale: ptBR,
      }
    )
  };

  console.log(JSON.stringify(post, null, 2));
  //console.log(JSON.stringify(response, null, 2));

  return {
    props: {
      post,
    }
  }
};
