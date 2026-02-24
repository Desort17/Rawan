import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Volume2, VolumeX, Sparkles, Moon, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generatePoemAudio, POEM_TEXT } from './geminiService';

const StarField = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.7 + 0.3,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{ 
            duration: Math.random() * 3 + 2, 
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadAudio = async () => {
      setIsLoading(true);
      const url = await generatePoemAudio();
      setAudioUrl(url);
      setIsLoading(false);
    };
    loadAudio();
  }, []);

  const handleOpen = () => {
    setIsOpened(true);
    
    // Confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fce4ec', '#f8bbd0', '#f06292', '#e91e63']
    });

    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a051a]">
      {/* Arabian Nights Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a051a] via-[#1a0b3d] to-[#2d1b4d]" />
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_30%,#4a148c_0%,transparent_70%)]" />
      
      <StarField />
      
      {/* Moon */}
      <motion.div 
        className="absolute top-10 right-10 text-yellow-100/20"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Moon size={120} strokeWidth={1} />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl px-6">
        <AnimatePresence mode="wait">
          {!isOpened ? (
            <motion.div
              key="envelope"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.2, opacity: 0, y: -100 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="relative group cursor-pointer" onClick={handleOpen}>
                <motion.div 
                  className="w-80 h-56 bg-[#fce4ec] rounded-lg shadow-2xl relative overflow-hidden border-2 border-[#f8bbd0]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Envelope Flap */}
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-[#f8bbd0] origin-top clip-path-envelope" />
                  
                  {/* Seal */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#e91e63] rounded-full shadow-lg flex items-center justify-center border-2 border-white/20">
                    <Sparkles className="text-white" size={20} />
                  </div>
                </motion.div>
                
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-pink-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="text-center space-y-4">
                <h1 className="text-3xl font-serif italic text-pink-200 tracking-wide">
                  A Letter from the Stars
                </h1>
                <p className="text-pink-100/60 font-sans text-sm tracking-widest uppercase">
                  Click to open the message
                </p>
                {isLoading && (
                  <motion.div 
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-pink-300 text-xs"
                  >
                    Preparing the voice...
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="letter-content"
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-[#fff9fb] p-8 md:p-12 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              {/* Decorative Border */}
              <div className="absolute inset-4 border-2 border-[#f8bbd0] pointer-events-none" />
              <div className="absolute inset-6 border border-[#fce4ec] pointer-events-none" />

              {/* Audio Controls */}
              <div className="absolute top-6 right-6 flex items-center gap-4">
                <button 
                  onClick={toggleAudio}
                  className="p-2 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100 transition-colors shadow-sm"
                >
                  {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
              </div>

              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-pink-400 font-serif italic text-sm">To the one who shines,</p>
                    <p className="text-pink-300 font-sans text-[10px] uppercase tracking-widest">February 24, 2026</p>
                  </div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="text-pink-200"
                  >
                    <Star size={24} fill="currentColor" />
                  </motion.div>
                </div>

                <div className="arabic-text text-2xl md:text-3xl leading-relaxed text-gray-800 text-right space-y-4">
                  {POEM_TEXT.split('\n').map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>

                <div className="pt-8 flex justify-between items-end">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    className="text-pink-400 font-serif italic"
                  >
                    With love, from the desert night
                  </motion.div>
                  <div className="text-pink-200">
                    <Sparkles size={32} />
                  </div>
                </div>
              </div>

              {/* Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      
      <style>{`
        .clip-path-envelope {
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }
      `}</style>
    </div>
  );
}
