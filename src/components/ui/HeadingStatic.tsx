interface HeadingStaticProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  text: string;
  as?: "h1" | "h2"; // h2 por defecto: solo un h1 por página
}

const HeadingStatic = ({
  children,
  icon,
  text,
  as: Tag = "h2",
}: HeadingStaticProps) => {
  return (
    <section className="mx-auto max-w-2xl text-center">
      <div className="flex items-center justify-center gap-2">
        <span
          className="text-gold w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center"
          aria-hidden="true"
        >
          {icon}
        </span>

        <Tag className="text-2xl font-semibold text-gold font-iceland sm:text-3xl md:text-4xl lg:text-5xl">
          {children}
        </Tag>
      </div>

      <p className="mt-6 text-base sm:text-lg font-inter text-white/80 leading-relaxed">
        {text}
      </p>
    </section>
  );
};

export default HeadingStatic;
