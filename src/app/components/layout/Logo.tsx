import Link from "next/link";

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

const Logo = ({ className, onClick }: LogoProps) => {
  return (
    <Link href="/" onClick={onClick}>
      <svg
        width="300"
        height="100"
        viewBox="0 0 300 100"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="RC Web Logo"
        className={`${className} rounded-full p-2`}
      >
        <text
          x="10"
          y="65"
          fontSize="90"
          fill="#CBB26A"
          fontFamily="Iceland, sans-serif"
        >
          RC Web
        </text>
      </svg>
    </Link>
  );
};

export default Logo;
