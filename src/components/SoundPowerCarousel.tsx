"use client";

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

function VideoCard({ video }: { video: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div 
      className="relative w-[280px] md:w-[320px] aspect-[9/16] bg-gray-200 rounded-[2rem] overflow-hidden flex-shrink-0 snap-center cursor-pointer group shadow-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        if (isPlaying) handleMouseLeave(); else handleMouseEnter();
      }}
    >
      {video.videoUrl ? (
        <video 
          ref={videoRef}
          src={video.videoUrl}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          muted
          loop
          playsInline
          poster={video.thumbnailUrl}
        />
      ) : (
        <img src={video.thumbnailUrl} alt="thumbnail" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      )}
      
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
        <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-md">
          <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
        </div>
      </div>

      {video.caption && (
        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
           <p className="text-white font-bold text-lg leading-tight drop-shadow-md">{video.caption}</p>
        </div>
      )}
    </div>
  );
}

export default function SoundPowerCarousel({ data }: { data: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  if (!data || !data.videos || data.videos.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-24 bg-white border-t border-gray-200">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-10 mb-10">
        <h2 className="text-4xl md:text-[56px] font-black tracking-tighter uppercase mb-4 text-[#131317]">{data.title || 'Sound is Power'}</h2>
        <p className="text-lg md:text-xl text-gray-700 font-medium">{data.subtitle}</p>
      </div>

      <div className="relative max-w-[1440px] mx-auto px-4 md:px-8 lg:px-10 group">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white border border-gray-200 shadow-xl rounded-full flex items-center justify-center hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
        >
          <ChevronLeft className="w-8 h-8 text-black" />
        </button>

        <div ref={scrollRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-12 pt-4 -mx-4 px-4 md:mx-0 md:px-0">
          {data.videos.map((vid: any, idx: number) => (
            <VideoCard key={idx} video={vid} />
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white border border-gray-200 shadow-xl rounded-full flex items-center justify-center hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
        >
          <ChevronRight className="w-8 h-8 text-black" />
        </button>
      </div>
    </div>
  );
}