import {  Zap, ExternalLink, Star, Volume2, Share2,Bot } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden mt-16 bg-black text-white select-none">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-600 rounded-full animate-ping opacity-15"></span>
        <span className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping opacity-20 animation-delay-1000"></span>
        <span className="absolute top-1/2 left-3/4 w-2 h-2 bg-pink-600 rounded-full animate-ping opacity-15 animation-delay-2000"></span>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 text-center space-y-8 max-w-4xl">
        {/* Logo */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-60 blur-lg filter transition-opacity duration-1000 group-hover:opacity-100"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-purple-700 via-pink-700 to-blue-700 rounded-2xl flex items-center justify-center">
                <Bot className="h-8 w-8 text-white animate-pulse" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-white via-purple-300 to-blue-300 bg-clip-text text-transparent drop-shadow-md">
              Botcats
            </h3>
          </div>
        </div>

        {/* Bolt Credit */}
        <div className="relative flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-3 text-white/70 tracking-wide uppercase font-semibold text-xs">
            <span>Crafted with</span>
            <span>using</span>
          </div>
          <a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-black/90 hover:bg-black rounded-2xl px-8 py-3 font-extrabold text-base flex items-center space-x-3 shadow-md ring-1 ring-white/20 transition-all duration-300"
          >
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
              <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300 text-white" />
            </div>
            <span className="tracking-wider text-white drop-shadow-md">Bolt.new</span>
            <ExternalLink className="h-4 w-4 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </a>

          <p className="max-w-md text-center text-white/50 text-xs font-light">
            Built on the cutting-edge Bolt.new platform - where ideas become reality at the speed of thought
          </p>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-xs text-white/60 font-semibold tracking-wide">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            <div className="flex items-center space-x-1.5">
              <Star className="h-3 w-3 text-yellow-400 drop-shadow" />
              <span>AI Technology</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full self-center"></div>
            <div className="flex items-center space-x-1.5">
              <Volume2 className="h-3 w-3 text-blue-400 drop-shadow" />
              <span>Professional Audio</span>
            </div>
            <div className="hidden md:block w-1 h-1 bg-white/30 rounded-full self-center"></div>
            <div className="flex items-center space-x-1.5">
              <Share2 className="h-3 w-3 text-green-400 drop-shadow" />
              <span>Easy Sharing</span>
            </div>
          </div>
          <div>Â© 2025 Botcats. Powered by next-generation AI.</div>
        </div>
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-60"></div>
    </footer>
  )
}

export default Footer