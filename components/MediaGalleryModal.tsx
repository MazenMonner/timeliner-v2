import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, XMarkIcon } from './icons';

interface MediaGalleryModalProps {
  images: string[];
  onClose: () => void;
}

export const MediaGalleryModal: React.FC<MediaGalleryModalProps> = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, goToPrevious, goToNext]);
  
  if (images.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="relative w-full h-full max-w-4xl max-h-4/5 p-4 flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-2 hover:bg-black/60 transition-colors z-10"
          aria-label="Close gallery"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="relative w-full h-full flex items-center justify-center">
             <button 
                onClick={goToPrevious} 
                className="absolute left-0 text-white bg-black/30 rounded-full p-2 hover:bg-black/60 transition-colors z-10 m-4"
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="w-8 h-8"/>
            </button>
            <img 
              src={images[currentIndex]} 
              alt={`Event media ${currentIndex + 1}`} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <button 
                onClick={goToNext} 
                className="absolute right-0 text-white bg-black/30 rounded-full p-2 hover:bg-black/60 transition-colors z-10 m-4"
                aria-label="Next image"
             >
                <ChevronLeftIcon className="w-8 h-8 rotate-180"/>
            </button>
        </div>
        <div className="text-white text-center mt-4 text-sm bg-black/30 px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};