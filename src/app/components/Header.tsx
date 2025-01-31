//Components
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";

const Header = () => {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 ">
        <Navbar />
      </header>
      <Hero />
    </>
  );
};

export default Header;
