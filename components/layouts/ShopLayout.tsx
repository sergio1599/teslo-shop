import Head from 'next/head';
import { FC } from 'react';
import { NavBar } from '../ui';

interface Props {
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
  children: JSX.Element | JSX.Element[];
}

export const ShopLayout: FC<Props> = ({
  children,
  title,
  pageDescription,
  imageFullUrl,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />
        <meta name="og:title" content={title} />
        <meta name="og:desciption" content={pageDescription} />
        {imageFullUrl && <meta name="og:image" content={imageFullUrl} />}
      </Head>
      <nav>
        <NavBar />
      </nav>
      {/* SideBar */}
      <main
        style={{
          margin: '80px auto',
          maxWidth: '1440px',
          padding: '0px 40px',
        }}
      >
        {children}
      </main>
      <footer>{/* Custom footer */}</footer>
    </>
  );
};
