import React, { useEffect, useRef, useState } from 'react';

interface AudioPlayerWithSpeedProps {
  src: string;
  speed: number;
}

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
};

const AudioPlayerWithSpeed: React.FC<AudioPlayerWithSpeedProps> = ({ src, speed }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
      setCurrent(0);
    }
  }, [src]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={e => setCurrent((e.target as HTMLAudioElement).currentTime)}
        onLoadedMetadata={e => setDuration((e.target as HTMLAudioElement).duration)}
        onEnded={() => setPlaying(false)}
        style={{ display: 'none' }}
      />
      <div className="flex items-center w-full gap-3">
        <button
          onClick={togglePlay}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          {playing ? (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor"/></svg>
          ) : (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M7 5v14l11-7z" fill="currentColor"/></svg>
          )}
        </button>
        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-purple-200 w-10 text-right">{formatTime(current)}</span>
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.01}
            value={current}
            onChange={e => {
              const t = Number(e.target.value);
              setCurrent(t);
              if (audioRef.current) audioRef.current.currentTime = t;
            }}
            className="w-full accent-purple-500 h-1 bg-purple-300 rounded-lg"
          />
          <span className="text-xs text-purple-200 w-10">{formatTime(duration)}</span>
        </div>
        <span className="ml-2 text-xs text-pink-300 font-semibold bg-white/10 px-2 py-1 rounded-lg">x{speed.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default AudioPlayerWithSpeed;
