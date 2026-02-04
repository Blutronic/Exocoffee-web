import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryImage } from '@/shared/types';

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'center',
      skipSnaps: false,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
    }
  };

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (images.length === 0) {
    return (
      <div className="relative py-24 px-6 bg-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
            Our Recent Work
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Gallery coming soon - check back to see our latest service photos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-24 px-6 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
            Our Recent Work
          </h2>
          <p className="text-xl text-zinc-400">
            See the quality of our professional service and repairs
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
                    <img
                      src={`/api/gallery/image/${image.image_key}`}
                      alt={image.title || 'Gallery image'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        {image.title && (
                          <h3 className="text-xl font-bold text-white mb-2">
                            {image.title}
                          </h3>
                        )}
                        {image.description && (
                          <p className="text-zinc-300 text-sm">
                            {image.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-zinc-900/90 border border-zinc-800 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-cyan-500 hover:border-cyan-500 transition-all duration-300 group"
          >
            <ChevronLeft className="w-6 h-6 text-zinc-400 group-hover:text-white" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-zinc-900/90 border border-zinc-800 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-cyan-500 hover:border-cyan-500 transition-all duration-300 group"
          >
            <ChevronRight className="w-6 h-6 text-zinc-400 group-hover:text-white" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? 'w-8 bg-cyan-500'
                    : 'bg-zinc-700 hover:bg-zinc-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
