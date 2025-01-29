//Components
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";

const Header = () => {
  return (
    <div className="bg-gray-900">
      <header className="fixed inset-x-0 top-0 z-50">
        <Navbar />
      </header>
      <Hero />
    </div>
  );
};

export default Header;
