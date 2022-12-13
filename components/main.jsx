import React from "react";
import Image from "next/legacy/image";

const Main = () => {
  return (
    <main className="static w-10/12 h-screen overflow-y-scroll -z-10 bg-img">
      <Image
        className="w-10/12 h-full mix-blend-overlay  "
        src="/img/background.JPG"
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        priority
      />
      <h1 className="mt-24 ">Hello</h1>
    </main>
  );
};

export default Main;
