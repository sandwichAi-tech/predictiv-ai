import { useState, useRef, useEffect } from "react";
import { Play, Pause, Headphones, Copy, Share2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import podcastCover from "@/assets/podcast-cover.jpg";

const PodcastPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [hasTrackedPlay, setHasTrackedPlay] = useState(false);
  const [hasTrackedComplete, setHasTrackedComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const trackPodcast = async (action: 'play' | 'complete', extra: Record<string, unknown> = {}) => {
    try {
      await supabase.from('analytics_events').insert({
        event_type: action === 'play' ? 'podcast_play' : 'podcast_complete',
        visitor_id: localStorage.getItem('_vid'),
        session_id: sessionStorage.getItem('_sid'),
        page_url: window.location.href,
        event_data: { episode: 'Wall Street Deal Room - BBLC', ...extra },
      });
    } catch (e) {
      console.error('podcast track error', e);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (!hasTrackedComplete) {
        trackPodcast('complete', { duration_seconds: Math.round(audio.duration || 0) });
        setHasTrackedComplete(true);
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [hasTrackedComplete]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
        if (!hasTrackedPlay) {
          trackPodcast('play');
          setHasTrackedPlay(true);
        }
      } catch (error) {
        console.error("Playback failed:", error);
        toast.error("Unable to play audio. Please try again.");
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.muted = false;
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href + "#podcast");
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Wall Street Deal Room Deep Dive - BBLC",
      text: "Listen to the exclusive deep dive on Blockchain Loyalty Corp with Jeff Coleman & Jill Stein.",
      url: window.location.href + "#podcast",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await copyLink();
      }
    } catch {
      // User cancelled share
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section id="podcast" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="podcast-container">
          {/* Top Badges */}
          <div className="flex items-center gap-3 mb-6">
            <span className="podcast-badge podcast-badge-featured">
              AS FEATURED ON
            </span>
            <span className="podcast-badge podcast-badge-duration">
              14:23 DEEP DIVE
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Podcast Thumbnail */}
            <div className="podcast-thumbnail-wrapper">
              <div 
                className="podcast-thumbnail"
                onClick={togglePlay}
              >
                {/* Podcast Cover Image */}
                <img 
                  src={podcastCover} 
                  alt="Wall Street Deal Room - Jeff Coleman and Jill Stein"
                  className="w-full h-full object-cover"
                />
                
                {/* Play Button Overlay */}
                <button 
                  className="podcast-play-btn"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white ml-0" fill="white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  )}
                </button>
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h3 className="text-green font-mono text-sm tracking-[0.2em] mb-2">
                  WALL STREET DEAL ROOM
                </h3>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Deep Dive: Blockchain Loyalty Corp
                </h2>
                
                {/* Hosts */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
                  <span className="font-mono text-sm">
                    Hosted by <span className="text-foreground">Jeff Coleman</span> & <span className="text-foreground">Jill Stein</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                An exclusive institutional-grade analysis of BBLC's revolutionary blockchain loyalty platform. 
                Our analysts break down the technology, market opportunity, and investment thesis in this 
                comprehensive deep dive episode.
              </p>

              {/* Audio Progress Bar */}
              <div className="space-y-2">
                <div 
                  className="podcast-progress-container"
                  onClick={handleSeek}
                >
                  <div 
                    className="podcast-progress-bar"
                    style={{ width: `${progress}%` }}
                  />
                  <div 
                    className="podcast-progress-thumb"
                    style={{ left: `${progress}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={toggleMute}
                        className="hover:text-green transition-colors"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="podcast-volume-slider"
                        aria-label="Volume"
                      />
                    </div>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={togglePlay}
                  className="btn-podcast-primary"
                >
                  <Headphones className="w-4 h-4 mr-2" />
                  {isPlaying ? "Pause Episode" : "Listen Now"}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={copyLink}
                  className="btn-podcast-secondary"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleShare}
                  className="btn-podcast-secondary"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Share Note */}
              <p className="text-xs text-muted-foreground/70 font-mono">
                Share this episode with fellow investors interested in blockchain loyalty technology.
              </p>
            </div>
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} preload="metadata">
          <source src="/audio/deep-dive-bblc.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </section>
  );
};

export default PodcastPlayer;
