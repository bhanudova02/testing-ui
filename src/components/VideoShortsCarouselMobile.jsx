'use client';

import { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const videos = [
  { id: 1, title: 'MULTI DRYFIT PANT', skuCode: 'P502', videoUrl: "https://dazzlev1.b-cdn.net/ECommerce/Home_short_reels/01-P-502.mp4" },
  { id: 2, title: 'MATTY SLIMFIT TSHIRT', skuCode: 'D313', videoUrl: "https://dazzlev1.b-cdn.net/ECommerce/Home_short_reels/02-D313-MATTYSLIMFITTSHIRT.mp4" },
  { id: 3, title: 'MULTI DRYFIT  SHORT', skuCode: 'P534', videoUrl: "https://dazzlev1.b-cdn.net/ECommerce/Home_short_reels/03-P-534.mp4" },
];

export default function VideoShortsCarouselMobile() {
  const [reelMode, setReelMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef([]);

  // Auto play only visible video
  useEffect(() => {
    if (!reelMode) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          const video = videoRefs.current[index];
          if (!video) return;

          if (entry.isIntersecting) {
            setActiveIndex(index);
            video.muted = false;
            video.play();
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      {
        threshold: 0.8,
      }
    );

    videoRefs.current.forEach((video, i) => {
      const el = document.querySelector(`[data-index="${i}"]`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [reelMode]);

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {!reelMode && (
        <div className="p-4">
          <h1 className="text-xl font-bold text-center mb-4">Watch & Buy</h1>
          <Swiper
            spaceBetween={10}
            slidesPerView={2.5}
            className="w-full"
          >
            {videos.map((video, index) => (
              <SwiperSlide key={video.id}>
                <div
                  className="rounded overflow-hidden cursor-pointer relative"
                  onClick={() => {
                    setActiveIndex(index);
                    setReelMode(true);
                  }}
                >
                  <video
                    src={video.videoUrl}
                    muted
                    playsInline
                    loop
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute bottom-0 bg-black/50 w-full text-xs p-1 truncate">
                    {video.title}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {reelMode && (
        <div className="relative h-screen">
          <Swiper
            direction="vertical"
            slidesPerView={1}
            initialSlide={activeIndex}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            mousewheel
            modules={[A11y]}
            className="h-full"
          >
            {videos.map((video, index) => (
              <SwiperSlide key={video.id}>
                <div
                  className="w-full h-screen flex flex-col items-center justify-center relative"
                  data-index={index}
                >
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={video.videoUrl}
                    className="w-full h-full object-cover"
                    playsInline
                    muted={false}
                    loop
                    controls={false}
                    autoPlay={index === activeIndex}
                  />
                  <div className="absolute bottom-6 left-4 text-white bg-black/50 px-3 py-1 rounded">
                    <h2 className="text-lg font-semibold">{video.title}</h2>
                    <p className="text-xs">SKU: {video.skuCode}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            className="absolute top-4 left-4 bg-white text-black px-3 py-1 rounded-full text-sm shadow"
            onClick={() => setReelMode(false)}
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
