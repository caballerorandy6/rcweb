import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface CertificationProps {
  name: string;
  platform: string;
  description: string;
  image: string; // Puede ser una URL de imagen o PDF
  tutor: string;
  url: string;
  pdfThumbnail?: string; // Opcional: URL de thumbnail pre-generado para PDFs
}

const Certification = ({
  name,
  platform,
  description,
  image,
  tutor,
  url,
  pdfThumbnail,
}: CertificationProps) => {
  const [imageError, setImageError] = useState(false);
  const isPDF = image.endsWith(".pdf");

  // Función para determinar qué mostrar en el preview
  const renderPreview = () => {
    // Si es PDF y tenemos thumbnail, usarlo
    if (isPDF && pdfThumbnail) {
      return (
        <Image
          alt={name}
          src={pdfThumbnail}
          width={1000}
          height={1000}
          className="w-full h-36 object-cover rounded-t-lg transition-transform duration-300 hover:scale-110"
          priority={false}
          onError={() => setImageError(true)}
        />
      );
    }

    // Si es PDF sin thumbnail, mostrar placeholder o iframe
    if (isPDF) {
      return (
        <div className="relative w-full h-36 bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
          {/* Opción A: Placeholder estilizado */}
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto text-gold/50 mb-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,19L8,14H10L12,19H10M14,19L12,14H14L16,19H14Z" />
            </svg>
            <p className="text-xs text-white/60 font-inter">Certificado PDF</p>
          </div>

          {/* Opción B: Si quieres usar react-pdf, descomentar esto */}
          {/* <Document file={image} loading={<div>Cargando...</div>}>
            <Page pageNumber={1} width={300} height={144} />
          </Document> */}
        </div>
      );
    }

    // Si es imagen regular
    return (
      <Image
        alt={name}
        src={imageError ? "/placeholder-certificate.jpg" : image}
        width={1000}
        height={1000}
        className="w-full h-36 object-cover rounded-t-lg transition-transform duration-300 hover:scale-110"
        priority={false}
        onError={() => setImageError(true)}
      />
    );
  };

  return (
    <>
      <div className="overflow-hidden rounded-t-lg bg-gray-800 relative group">
        {renderPreview()}

        {isPDF && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-inter">
            PDF
          </div>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-2xl font-iceland text-gold">{name}</h3>

        <p className="mt-2 text-base text-white/80 font-inter">{description}</p>

        <div className="flex flex-wrap justify-center gap-1 mt-4">
          <span className="inline-flex gap-2 items-center rounded-full px-2 py-0.5 text-xs font-inter bg-gold/10 text-gold/90 border border-gold/30">
            {platform}
          </span>
          <span className="inline-flex gap-2 items-center rounded-full px-2 py-0.5 text-xs font-inter bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {tutor}
          </span>
        </div>
      </div>

      <div className="flex divide-gray-700 border-t border-gold/50 mt-auto">
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 text-base font-inter text-gold hover:bg-gray-800 transition rounded-bl-lg border-r border-gold/50 text-center flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          {isPDF ? "See PDF" : "See Certificate"}
        </Link>
        <button
          onClick={() => {
            if (isPDF) {
              const link = document.createElement("a");
              link.href = url;
              link.download = `${name}.pdf`;
              link.click();
            } else {
              window.open(url, "_blank");
            }
          }}
          className="flex-1 py-3 text-base font-inter text-gold hover:bg-gray-800 transition rounded-br-lg flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download
        </button>
      </div>
    </>
  );
};

export default Certification;
