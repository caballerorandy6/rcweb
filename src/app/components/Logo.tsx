import Image from "next/image";

const Logo = () => {
  return (
    <Image
      src="/logo.webp"
      alt="logo"
      width={400} // un ancho realista
      height={200}
      className="mx-auto h-auto w-auto max-w-[60%] sm:max-w-[50%] md:max-w-[40%] lg:max-w-[30%]"
    />
  );
};

export default Logo;
