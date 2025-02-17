interface HeadingProps {
  children: React.ReactNode;
  icon: React.ReactNode;
}

const HeadingDialog = ({ children, icon }: HeadingProps) => {
  return (
    <h1 className="flex items-center justify-center gap-x-2 text-gold font-mono font-bold text-3xl text-center uppercase top-0 left-0 right-0 z-20">
      {icon}
      {children}
    </h1>
  );
};

export default HeadingDialog;
