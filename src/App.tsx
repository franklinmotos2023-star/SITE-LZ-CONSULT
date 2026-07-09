import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Check, Copy } from "lucide-react";

// Custom premium image logo from the user's Imgur link
const LZLogo = ({ className = "w-16 h-16" }: { className?: string }) => (
  <img
    src="https://i.imgur.com/peyGhBz.png"
    alt="LZ Logo"
    className={`${className} object-cover`}
    referrerPolicy="no-referrer"
  />
);

// High-fidelity Canva Brand Logo
const PresentationIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <img
    src="https://cdn.brandfetch.io/id9mVQlyB1/theme/dark/idC6GJnZFh.svg?c=1dxbfHSJFAPEGdCLU4o5B"
    alt="Canva Presentation"
    className={`${className} object-contain transition-all duration-300 brightness-0 group-hover:invert`}
    referrerPolicy="no-referrer"
  />
);

// High-fidelity vector SVG of the Google Drive logo
const GoogleDriveLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg"
    alt="Google Drive"
    className={`${className} object-contain transition-all duration-300 brightness-0 group-hover:invert`}
    referrerPolicy="no-referrer"
  />
);

export default function App() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const portfolioLinks = [
    {
      index: "01",
      title: "APRESENTAÇÃO PORTFÓLIO",
      description: "Visualize nossa apresentação estratégica interativa desenvolvida no Canva.",
      url: "https://www.canva.com/design/DAG2D7eJMPI/hAnK1EWaEXChO0EjhDrmvg/view?utlId=hae901ba460%231",
      icon: <PresentationIcon className="w-[115px] h-[65px]" />,
      actionText: "Abrir Apresentação"
    },
    {
      index: "02",
      title: "PORTFÓLIO COMPLETO",
      description: "Acesse nosso repositório completo de arquivos e projetos no Google Drive.",
      url: "https://drive.google.com/drive/u/1/folders/1OU6-hHnKodC33m1cKiYBYAvQbFkLypXT",
      icon: <GoogleDriveLogo className="w-16 h-16" />,
      actionText: "Acessar Google Drive"
    }
  ];

  const handleCopyLink = (url: string, index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="relative h-screen w-full text-black flex flex-col justify-between overflow-hidden p-4 sm:p-6 selection:bg-black selection:text-white">
      
      {/* Frosted Glass background grid & radial overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-5xl mx-auto w-full py-2 sm:py-4 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-2"
        >
          <LZLogo className="w-[28px] h-[25px] object-contain" />
          <span className="text-xs font-display font-black tracking-[0.15em] text-black uppercase">
            LZ CONSULT
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="text-[9px] sm:text-[10px] font-mono tracking-widest text-black/60 font-bold uppercase"
        >
          MARKETING STRATEGY // 2026
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center w-full my-auto">
        
        {/* Brand Showcase Block */}
        <div className="text-center mb-6 sm:mb-8 flex flex-col items-center">
          
          {/* Transparent Logo without bounds or background shape */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 sm:mb-6"
          >
            <LZLogo className="w-[92px] h-[80px] object-contain hover:scale-105 transition-transform duration-300" />
          </motion.div>
          
          {/* Premium Separator from design */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="h-[2px] w-8 bg-black" />
            <div className="mx-3 h-2.5 w-2.5 border-2 border-black rotate-45 bg-black" />
            <div className="h-[2px] w-8 bg-black" />
          </motion.div>

          {/* Titles */}
          <div className="inline-block max-w-full px-2">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="font-display font-black text-5xl sm:text-6xl md:text-7xl tracking-tighter uppercase leading-none mb-2 text-black"
            >
              LZ CONSULT
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="text-[9px] sm:text-[11px] md:text-[13px] tracking-[0.12em] sm:tracking-[0.24em] uppercase font-medium text-black/80 whitespace-nowrap overflow-hidden text-ellipsis block text-center"
            >
              Consultoria de marketing para você.
            </motion.p>
          </div>
        </div>

        {/* Brutalist Frosted Glass Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-2xl w-full justify-center px-4">
          {portfolioLinks.map((item, idx) => (
            <motion.a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 + idx * 0.15 }}
              whileHover={{ 
                x: 4,
                y: 4,
                transition: { duration: 0.2 }
              }}
              className="group relative aspect-square w-full max-w-[240px] sm:max-w-[260px] mx-auto bg-white/40 backdrop-blur-md border-[3px] border-black p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:bg-black hover:text-white shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-none cursor-pointer overflow-hidden"
            >
              {/* Card Header: Number & Action Buttons */}
              <div className="flex justify-between items-start z-10">
                <span className="font-mono text-xs sm:text-sm font-light text-black/60 group-hover:text-white/60 transition-colors duration-300">
                  {item.index}
                </span>
                <div className="flex items-center gap-2">
                  {/* Share/Copy Button */}
                  <button
                    onClick={(e) => handleCopyLink(item.url, idx, e)}
                    className="p-1.5 rounded-none border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-300 group-hover:bg-neutral-900 group-hover:border-white group-hover:text-white"
                    title="Copiar Link"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 group-hover:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Card Center: Beautiful Massive Icon */}
              <div className="my-auto py-1.5 flex justify-center text-black group-hover:text-white transition-colors duration-300 z-10">
                <div className="transition-transform duration-500 group-hover:scale-110">
                  {item.icon}
                </div>
              </div>

              {/* Card Footer: Text Details */}
              <div className="space-y-1 text-center z-10">
                <h3 className="font-display font-bold text-lg sm:text-xl tracking-tighter uppercase leading-tight">
                  {item.title}
                </h3>
                
                {/* Arrow signifier in bottom right corner */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

      </main>

      {/* Mini empty spacer to balance layout heights visually */}
      <div className="h-4 sm:h-8" />
    </div>
  );
}
