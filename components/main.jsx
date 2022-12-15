import React from "react";
import Image from "next/legacy/image";

const Main = () => {
  return (
    <main className="fixed -z-10 w-full h-full bg-img">
      <Image
        className="mix-blend-overlay"
        src="/img/background.JPG"
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        priority
      />
    </main>
  );
};

export default Main;
