import type { ReactNode } from "react";

interface HeadingProps {
  children: ReactNode; // título
  icon: ReactNode; // ícono decorativo
  text: string; // descripción
  as?: "h1" | "h2"; // h2 por defecto: solo un h1 por página
}

/**
 * Cabecera de sección (icono + título + descripción). Server Component: el
 * título debe estar en el HTML inicial, sin depender de una animación.
 */
const Heading = ({ children, icon, text, as: Tag = "h2" }: HeadingProps) => {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="flex items-center justify-center gap-2">
        <span
          className="text-gold w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center"
          aria-hidden="true"
        >
          {icon}
        </span>

        <Tag className="text-2xl text-gold font-iceland sm:text-3xl md:text-4xl lg:text-5xl">
          {children}
        </Tag>
      </div>

      <p className="mt-6 text-base sm:text-lg font-inter text-white/80 leading-relaxed">
        {text}
      </p>
    </div>
  );
};

export default Heading;
