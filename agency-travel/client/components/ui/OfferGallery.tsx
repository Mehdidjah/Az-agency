import { Images } from "lucide-react";

export interface OfferGalleryProps {
  images: string[];
  alt?: string;
}

const OfferGallery = ({ images, alt = "" }: OfferGalleryProps) => {
  const mainImage = images[0];
  const sideImages = images.slice(1, 4);
  const totalPhotos = images.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 rounded-2xl">
      {/* Main large image */}
      <div className="relative h-[300px] sm:h-[400px] lg:h-[440px] overflow-hidden rounded-2xl">
        <img
          src={mainImage}
          alt={alt}
          className="w-full h-full object-cover"
        />
        <button className="absolute bottom-4 left-4 inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-black-100 text-sm font-medium tracking-tight px-4 py-2.5 rounded-full hover:bg-white transition-colors shadow-md">
          <Images className="w-4 h-4" />
          Voir toutes les photos ({totalPhotos})
        </button>
      </div>

      {/* Side images stack */}
      <div className="hidden lg:grid lg:grid-rows-3 gap-3 h-[440px]">
        {sideImages.map((src, i) => (
          <div
            key={i}
            className="h-full overflow-hidden rounded-2xl"
          >
            <img
              src={src}
              alt={`${alt} ${i + 2}`}
              className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferGallery;
