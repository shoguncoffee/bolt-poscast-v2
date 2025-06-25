import React, { useEffect, useRef } from 'react';

interface AudioPlayerWithSpeedProps {
  src: string;
  speed: number;
}

const AudioPlayerWithSpeed: React.FC<AudioPlayerWithSpeedProps> = ({ src, speed }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      // ถ้าเปลี่ยน src ให้รีเซ็ตการเล่น
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [src]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  return (
    <audio
      ref={audioRef}
      controls
      src={src}
      className="w-full mb-4"
      style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem' }}
    />
  );
};

export default AudioPlayerWithSpeed;
