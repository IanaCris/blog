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
    subtitle: string;
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
  uid: string;
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  // console.log(post);

  const totalWords = post.data.content.reduce((total, contentItem) => {
    total += contentItem.heading.split(' ').length;

    const words = contentItem.body.map(item => item.text.split(' ').length);
    words.map(word => (total += word));

    return total;
  }, 0);

  const readingTime = Math.ceil(totalWords / 200);

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

      <div className={styles.bannerImage} />

      <main className={styles.container}>
        <div className={styles.content}>
          <h1>{post.data.title}</h1>
          <p>{post.data.subtitle}</p>

          <div className={styles.info}>
            <span>
              <FiCalendar />
              <time>
                {format(new Date(post.first_publication_date), 'PP', {
                  locale: ptBR,
                })}
              </time>
            </span>

            <span>
              <FiUser />
              <p>{post.data.author}</p>
            </span>

            <span>
              <FiClock />
              <p>{`${readingTime} min`}</p>
            </span>
          </div>

          <div className={styles.postContent}>
            {post.data.content.map(({ heading, body }) => (
              <div key={heading}>
                {heading && <h2>{heading}</h2>}

                <div className={styles.postSection}
                  dangerouslySetInnerHTML={{ __html: RichText.asHtml(body) }}
                />
              </div>
            ))}
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
      subtitle: response.data.subtitle,
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

  //console.log(JSON.stringify(post, null, 2));
  //console.log(JSON.stringify(response, null, 2));

  return {
    props: {
      post,
    },
    revalidate: 60 * 30,
  }
};
