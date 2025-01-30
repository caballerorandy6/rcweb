//Components
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";

const Header = () => {
  return (
    <section id="home">
      <header className="fixed inset-x-0 top-0 z-50 ">
        <Navbar />
      </header>
      <Hero />
    </section>
  );
};

export default Header;
