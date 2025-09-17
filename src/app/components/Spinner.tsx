"use client";

export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      {/* Loading text */}
      <div className="text-gold font-iceland font-medium text-4xl mb-2">
        Loading...
      </div>
      {/* Spinner */}
      <div className="relative w-[200px] h-[28px] rounded-[20px] border-2 border-[#514b82] text-gold overflow-hidden mb-4">
        <div className="absolute inset-0 right-full m-[2px] rounded-[inherit] bg-current animate-slide"></div>

        <style jsx>{`
          @keyframes slide {
            0% {
              inset: 0 100% 0 0;
            }
            100% {
              inset: 0 0 0 0;
            }
          }
          .animate-slide {
            animation: slide 2s infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
