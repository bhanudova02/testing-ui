import { useState, useRef, useEffect } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

export default function VideoShortsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [isMuted, setIsMuted] = useState(true); // Track mute state

  const containerRef = useRef(null);
  const videoRefs = useRef({});
  const modalVideoRefs = useRef({});
  const mobileVideoRefs = useRef({});
  
  const videos = [
    { id: 1, videoUrl: "/short-video-1.mp4" },
    { id: 2, videoUrl: "/short-video-2.mp4" },
    { id: 3, videoUrl: "/short-video-3.mp4" },
    { id: 4, videoUrl: "/short-video-4.mp4" },
    { id: 5, videoUrl: "/short-video-5.mp4" },
    { id: 6, videoUrl: "/short-video-6.mp4" },
    { id: 7, videoUrl: "/short-video-1.mp4" },
    { id: 8, videoUrl: "/short-video-2.mp4" },
    { id: 9, videoUrl: "/short-video-3.mp4" },
    { id: 10, videoUrl: "/short-video-4.mp4" },
    { id: 11, videoUrl: "/short-video-5.mp4" },
    { id: 12, videoUrl: "/short-video-6.mp4" },
  ];

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      setIsMobileView(width < 1024);

      if (width < 640) setVisibleCount(1);
      else if (width < 1024) setVisibleCount(4);
      else setVisibleCount(6);

      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const gap = 12;
  const cardWidth = (containerWidth - gap * (visibleCount - 1)) / visibleCount;
  const totalWidth = videos.length * cardWidth + gap * (videos.length - 1);
  const maxIndex = Math.max(0, videos.length - visibleCount);
  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex >= maxIndex;

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [visibleCount, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - visibleCount));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + visibleCount));
  };

  useEffect(() => {
    Object.values(videoRefs.current).forEach((video) => {
      if (video) video.play().catch(() => {});
    });
  }, [currentIndex]);

  useEffect(() => {
    if (!isModalOpen || isMobileView) return;

    Object.entries(modalVideoRefs.current).forEach(([idx, video]) => {
      if (!video) return;

      if (Number(idx) === modalIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [modalIndex, isModalOpen, isMobileView]);

  useEffect(() => {
    if (!isMobileView || !isModalOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoId = entry.target.dataset.videoId;
          const video = mobileVideoRefs.current[videoId];

          if (!video) return;

          if (entry.isIntersecting) {
            video.play().catch(() => {});
            setActiveVideoId(videoId);
          } else {
            video.pause();
            video.muted = true;
          }
        });
      },
      { threshold: 0.7 }
    );

    const videoContainers = document.querySelectorAll(".mobile-video-container");
    videoContainers.forEach((el) => observer.observe(el));

    return () => {
      videoContainers.forEach((el) => observer.unobserve(el));
    };
  }, [isMobileView, isModalOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen]);

  const toggleMute = (e) => {
    e.stopPropagation();

    if (activeVideoId && mobileVideoRefs.current[activeVideoId]) {
      const video = mobileVideoRefs.current[activeVideoId];
      const newMutedState = !video.muted;
      video.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  // Handle swipe or scroll to move to the next or previous video in modal
  const handleSwipe = (direction) => {
    if (direction === 'up') {
      setModalIndex((prev) => (prev + 1) % videos.length);
    } else if (direction === 'down') {
      setModalIndex((prev) => (prev - 1 + videos.length) % videos.length);
    }
  };

  return (
    <div className="relative w-full bg-gray-100 py-8">
      <h1 className="text-4xl font-bold text-center text-black mb-10">Watch and Buy</h1>

      <div className="relative flex items-center justify-center px-4 w-[95%] mx-auto">
        {!isAtStart && (
          <button
            onClick={handlePrev}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-gray-900/80 hover:bg-gray-800/90 text-white px-3 py-10 rounded-md shadow-lg transition-all transform hover:scale-110"
          >
            <span className="text-2xl">{"<"}</span>
          </button>
        )}

        <div ref={containerRef} className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              width: `${totalWidth}px`,
              gap: `${gap}px`,
              transform: `translateX(-${(cardWidth + gap) * currentIndex}px)`,
            }}
          >
            {videos.map((video, index) => (
              <div
                key={video.id}
                className="flex-shrink-0 h-[500px] md:h-[350px] rounded-lg overflow-hidden relative cursor-pointer"
                style={{ width: `${cardWidth}px` }}
              >
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[video.id] = el;
                  }}
                  onClick={() => {
                    setIsModalOpen(true);
                    setModalIndex(index);
                  }}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                >
                  <source src={video.videoUrl} type="video/mp4" />
                </video>
              </div>
            ))}
          </div>
        </div>

        {!isAtEnd && (
          <button
            onClick={handleNext}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-gray-900/80 hover:bg-gray-800/90 text-white px-3 py-10 rounded-md shadow-lg transition-all transform hover:scale-110"
          >
            <span className="text-2xl">{">"}</span>
          </button>
        )}
      </div>

      {/* Modal for Mobile/Tablet (Vertical Reels Style) */}
      {isModalOpen && isMobileView && (
        <div className="fixed inset-0 z-50 bg-black overflow-y-scroll snap-y snap-mandatory">
          <button
            className="fixed top-4 right-4 z-50 text-white text-xl bg-black/50 w-10 h-10 rounded-full"
            onClick={() => setIsModalOpen(false)}
          >
            ✕
          </button>

          {videos.map((video, index) => (
            <div
              key={video.id}
              data-video-id={video.id}
              className="mobile-video-container w-full h-screen snap-start flex items-center justify-center relative"
            >
              <video
                ref={(el) => {
                  if (el) mobileVideoRefs.current[video.id] = el;
                }}
                src={video.videoUrl}
                loop
                playsInline
                muted={isMuted}
                className="w-full h-full object-cover"
              />

              {/* Video Controls */}
              <div className="absolute bottom-20 right-4 flex flex-col items-center space-y-4 z-20">
                <button
                  onClick={toggleMute}
                  className="p-3 bg-black/60 rounded-full text-white text-xl hover:bg-black/80 focus:outline-none transform hover:scale-105 transition-all"
                >
                  {isMuted ? "🔇" : "🔊"}
                </button>
              </div>

              <div className="absolute bottom-10 left-4 right-4 text-white p-4 z-10">
                <h2 className="text-xl font-bold mb-2">Video {index + 1}</h2>
                <p className="mb-4">Product description goes here</p>
                <button
                  className="bg-white text-black font-bold py-2 px-4 rounded-full hover:bg-gray-200 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Buy button clicked for video", index + 1);
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
