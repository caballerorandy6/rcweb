interface HeadingProps {
  children: React.ReactNode;
}

const Heading = ({ children }: HeadingProps) => {
  return (
    <h1 className="text-gold font-mono font-bold text-3xl text-center mb-16">
      {children}
    </h1>
  );
};

export default Heading;
