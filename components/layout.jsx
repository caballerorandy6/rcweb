import Head from "next/head";
import Nav from "./nav";
import Main from "./main";
import Footer from "./footer";
import { ToastContainer } from "react-toastify";

//Estilos de Toastify
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children, title, description }) => {
  return (
    <>
      <Head>
        <title>{`RC Web - ${title}`}</title>
        <meta name="description" content={description} />
      </Head>

      <div className="flex flex-col h-screen overflow-y-scroll">
        <Nav />
        <Main />
        {children}
        <ToastContainer />
      </div>

      <Footer />
    </>
  );
};

export default Layout;
