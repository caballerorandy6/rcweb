"use client";

import { useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import useEmblaCarousel from "embla-carousel-react";
import Certification from './Certification';
import { CertificationProps } from './Certification';

const CertificationsList = ({
  certifications,
}: {
  certifications: CertificationProps[];
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16">
      {/* Carousel Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {certifications.map((certification) => (
            <div
              key={certification.name}
              className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
            >
              <div className="w-full h-[420px] bg-gray-900 text-center border border-gold/50 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.03] hover:border-gold/80 transition-all duration-200 animateProjectCard flex flex-col">
                <Certification
                  name={certification.name}
                  platform={certification.platform}
                  description={certification.description}
                  image={certification.image}
                  tutor={certification.tutor}
                  url={certification.url}
                  pdfThumbnail={certification.pdfThumbnail}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons - Below Cards */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={scrollPrev}
          className="bg-gold/90 hover:bg-gold text-gray-900 p-3 rounded-full shadow-xl transition-all duration-200 hover:scale-110"
          aria-label="Previous certification"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        <button
          onClick={scrollNext}
          className="bg-gold/90 hover:bg-gold text-gray-900 p-3 rounded-full shadow-xl transition-all duration-200 hover:scale-110"
          aria-label="Next certification"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default CertificationsList;
