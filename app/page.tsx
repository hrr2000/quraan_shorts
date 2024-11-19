"use client";

import { useState } from "react";
import { VideoCard } from "@/components/video-card";
import { videos } from "@/data/videos";

export default function Home() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const scrollPosition = e.currentTarget.scrollTop;
    const videoHeight = window.innerHeight;
    const index = Math.round(scrollPosition / videoHeight);
    setActiveVideoIndex(index);
  };

  return (
    <main 
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory"
      onScroll={handleScroll}
    >
      {videos.map((video, index) => (
        <VideoCard
          key={video.id}
          video={video}
          isActive={index === activeVideoIndex}
        />
      ))}
    </main>
  );
}