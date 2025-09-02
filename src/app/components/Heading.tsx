import { JSX } from "react";

interface HeadingProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  level?: 1 | 2 | 3;
}

const Heading = ({ children, icon, level = 1 }: HeadingProps) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag className="flex items-center justify-center gap-x-2 text-gold font-iceland tracking-tight text-5xl text-center mb-16 uppercase">
      {icon}
      {children}
    </HeadingTag>
  );
};

export default Heading;
