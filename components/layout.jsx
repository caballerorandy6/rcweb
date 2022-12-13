import Head from "next/head";
import Nav from "./nav";
import Main from "./main";
import Image from "next/legacy/image";

const Layout = ({ children, title, description }) => {
  return (
    <>
      <Head>
        <title>{`RC Web - ${title}`}</title>
        <meta name="description" content={description} />
      </Head>

      <div className="md:flex lg:flex">
        <Nav />
        <Main>{children}</Main>
      </div>
    </>
  );
};

export default Layout;
