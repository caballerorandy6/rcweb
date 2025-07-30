interface HeadingProps {
  children: React.ReactNode;
  icon: React.ReactNode;
}

const Heading = ({ children, icon }: HeadingProps) => {
  return (
    <h1 className="flex items-center justify-center gap-x-2 text-gold font-iceland tracking-tight text-5xl text-center mb-16 uppercase">
      {icon}
      {children}
    </h1>
  );
};

export default Heading;
