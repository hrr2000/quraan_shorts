"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { AlertCircle, Heart, MessageCircle, Share2, Volume2, VolumeX } from "lucide-react";
import { VideoData } from "@/types/video";

interface VideoCardProps {
  video: VideoData;
  isActive: boolean;
}

export function VideoCard({ video, isActive }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.7,
  });

  useEffect(() => {
    if (!videoRef.current) return;

    const videoElement = videoRef.current;

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    const handleLoadedData = () => {
      setIsLoading(false);
      if (isActive && inView) {
        videoElement.play().catch(() => {
          console.log("Autoplay prevented");
        });
      }
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    videoElement.addEventListener('loadstart', handleLoadStart);
    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('error', handleError);

    return () => {
      videoElement.removeEventListener('loadstart', handleLoadStart);
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('error', handleError);
    };
  }, [isActive, inView]);

  useEffect(() => {
    if (!videoRef.current || isLoading || hasError) return;

    if (isActive && inView) {
      videoRef.current.play().catch(() => {
        console.log("Playback prevented");
      });
    } else {
      videoRef.current.pause();
    }
  }, [isActive, inView, isLoading, hasError]);

  return (
    <div ref={ref} className="relative h-screen w-full snap-start bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
          <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
          <p className="text-white">Failed to load video</p>
        </div>
      )}

      <video
        ref={videoRef}
        src={video.url}
        className="h-full w-full object-cover"
        loop
        playsInline
        muted={isMuted}
        poster={video.thumbnail}
        preload="auto"
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <h2 className="text-white text-xl font-bold">{video.surah}</h2>
        <p className="text-white/80">{video.translation}</p>
        <p className="text-white/60 text-sm">{video.reciter}</p>
      </div>

      <div className="absolute right-4 bottom-20 flex flex-col gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/20 backdrop-blur-lg hover:bg-black/40"
          onClick={() => setIsMuted(!isMuted)}
          disabled={isLoading || hasError}
        >
          {isMuted ? (
            <VolumeX className="h-6 w-6 text-white" />
          ) : (
            <Volume2 className="h-6 w-6 text-white" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/20 backdrop-blur-lg hover:bg-black/40"
        >
          <Heart className="h-6 w-6 text-white" />
          <span className="text-white text-xs mt-1">{video.likes}</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/20 backdrop-blur-lg hover:bg-black/40"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          <span className="text-white text-xs mt-1">{video.comments}</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/20 backdrop-blur-lg hover:bg-black/40"
        >
          <Share2 className="h-6 w-6 text-white" />
          <span className="text-white text-xs mt-1">{video.shares}</span>
        </Button>
      </div>
    </div>
  );
}