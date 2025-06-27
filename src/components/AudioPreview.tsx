// import React, { useRef, useState, useEffect } from 'react';
// import { Headphones } from 'lucide-react';

// interface AudioPreviewProps {
//   audioUrl?: string;
//   speed: number;
//   podcastTitle: string;
// }

// const formatTime = (sec: number) => {
//   const m = Math.floor(sec / 60)
//     .toString()
//     .padStart(2, '0');
//   const s = Math.floor(sec % 60)
//     .toString()
//     .padStart(2, '0');
//   return `${m}:${s}`;
// };

// const AudioPreview: React.FC<AudioPreviewProps> = ({ audioUrl, speed, podcastTitle }) => {
//   const audioRef = useRef<HTMLAudioElement>(null);
//   const [playing, setPlaying] = useState(false);
//   const [current, setCurrent] = useState(0);
//   const [duration, setDuration] = useState(0);

//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.playbackRate = speed;
//       audioRef.current.pause();
//       audioRef.current.currentTime = 0;
//       setPlaying(false);
//       setCurrent(0);
//     }
//   }, [audioUrl, speed]);

//   const handlePlayPause = () => {
//     if (!audioRef.current) return;
//     if (playing) {
//       audioRef.current.pause();
//     } else {
//       audioRef.current.play();
//     }
//   };

//   const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const t = Number(e.target.value);
//     setCurrent(t);
//     if (audioRef.current) audioRef.current.currentTime = t;
//   };

//   return (
//     <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
//       <h3 className="text-lg font-semibold mb-4 flex items-center justify-center">
//         <Headphones className="w-5 h-5 mr-2" />
//         {podcastTitle || 'Untitled Podcast'}
//       </h3>
//       <div className="flex flex-col gap-2">
//         <div>
//           {audioUrl ? (
//             <>
//               <audio
//                 ref={audioRef}
//                 src={audioUrl}
//                 onPlay={() => setPlaying(true)}
//                 onPause={() => setPlaying(false)}
//                 onTimeUpdate={e => setCurrent((e.target as HTMLAudioElement).currentTime)}
//                 onLoadedMetadata={e => setDuration((e.target as HTMLAudioElement).duration)}
//                 onEnded={() => setPlaying(false)}
//                 style={{ display: 'none' }}
//               />
//               <div className="flex items-center w-full gap-3">
//                 <span className="text-xs text-purple-200 w-10 text-right">{formatTime(current)}</span>
//                 <input
//                   type="range"
//                   min={0}
//                   max={duration || 1}
//                   step={0.01}
//                   value={current}
//                   onChange={handleSeek}
//                   className="w-full accent-purple-500 h-1 bg-purple-300 rounded-lg"
//                 />
//                 <span className="text-xs text-purple-200 w-10">{formatTime(duration)}</span>
//               </div>
//             </>
//           ) : (
//             <div className="bg-black/30 rounded-xl p-4 mb-0">
//               <div className="flex items-center justify-center h-20">
//                 <div className="flex items-end space-x-1">
//                   {[...Array(40)].map((_, i) => (
//                     <div
//                       key={i}
//                       className={`w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full transition-all duration-150 opacity-30`}
//                       style={{ height: `${Math.random() * 60 + 10}px` }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//         {audioUrl && (
//           <div className="flex items-center justify-center">
//             <button
//               onClick={handlePlayPause}
//               className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
//               style={{ fontSize: 0 }}
//             >
//               {playing ? (
//                 <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor"/></svg>
//               ) : (
//                 <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M7 5v14l11-7z" fill="currentColor"/></svg>
//               )}
//             </button>
//           </div>
//         )}
//         <div className="flex items-center gap-2 justify-center">
//           {/* Download button removed, now in ExportShare */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AudioPreview;
