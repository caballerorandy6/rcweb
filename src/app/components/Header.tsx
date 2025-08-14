//Components
import Navbar from "@/app/components/Navbar";

const Header = () => {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 ">
        <Navbar />
      </header>
    </>
  );
};

export default Header;
