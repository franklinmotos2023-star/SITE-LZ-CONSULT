import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { PortfolioHub } from "./components/PortfolioHub";
import { LZLogo3D } from "./components/LZLogo3D";
import { SuccessCases } from "./components/SuccessCases";
import { StickmanWave3D } from "./components/StickmanWave3D";

// Custom premium LZ brand logo
const LZLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img
    src="https://i.imgur.com/peyGhBz.png"
    alt="LZ Logo"
    className={`${className} object-contain`}
    referrerPolicy="no-referrer"
  />
);

const TOTAL_STAGES = 3;

export default function App() {
  const [activeStage, setActiveStage] = useState<number>(0);
  const isAnimatingRef = useRef<boolean>(false);
  const touchStartYRef = useRef<number | null>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  const canvaUrl =
    "https://www.canva.com/design/DAG2D7eJMPI/hAnK1EWaEXChO0EjhDrmvg/view?utlId=hae901ba460%231";
  const driveUrl =
    "https://drive.google.com/drive/u/1/folders/1OU6-hHnKodC33m1cKiYBYAvQbFkLypXT";

  const goToStage = useCallback((nextStage: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_STAGES - 1, nextStage));
    if (isAnimatingRef.current) return;
    setActiveStage((prev) => {
      if (prev === clamped) return prev;
      isAnimatingRef.current = true;
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 720);
      return clamped;
    });
  }, []);

  // Intercept mouse wheel so the page rises smoothly in place without scrolling down the browser window
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) < 18) return;

      const currentEl = stageRefs.current[activeStage];
      if (currentEl) {
        const { scrollTop, scrollHeight, clientHeight } = currentEl;
        const canScrollInternally = scrollHeight > clientHeight + 4;

        if (canScrollInternally) {
          const atBottom = scrollTop + clientHeight >= scrollHeight - 6;
          const atTop = scrollTop <= 6;

          if (e.deltaY > 0 && !atBottom) {
            return; // allow internal content to finish scrolling before lifting next stage
          }
          if (e.deltaY < 0 && !atTop) {
            return;
          }
        }
      }

      e.preventDefault();
      if (e.deltaY > 0 && activeStage < TOTAL_STAGES - 1) {
        goToStage(activeStage + 1);
      } else if (e.deltaY < 0 && activeStage > 0) {
        goToStage(activeStage - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goToStage(activeStage + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goToStage(activeStage - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeStage, goToStage]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null || isAnimatingRef.current) return;
    const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
    touchStartYRef.current = null;

    if (Math.abs(deltaY) < 45) return;

    const currentEl = stageRefs.current[activeStage];
    if (currentEl) {
      const { scrollTop, scrollHeight, clientHeight } = currentEl;
      const canScrollInternally = scrollHeight > clientHeight + 4;
      if (canScrollInternally) {
        const atBottom = scrollTop + clientHeight >= scrollHeight - 6;
        const atTop = scrollTop <= 6;
        if (deltaY > 0 && !atBottom) return;
        if (deltaY < 0 && !atTop) return;
      }
    }

    if (deltaY > 0 && activeStage < TOTAL_STAGES - 1) {
      goToStage(activeStage + 1);
    } else if (deltaY < 0 && activeStage > 0) {
      goToStage(activeStage - 1);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="h-screen w-screen overflow-hidden bg-white text-black flex flex-col justify-between selection:bg-black selection:text-white"
    >
      {/* 
        TOP BAR CONTRACT:
        [Zone 1: Brand title, single line] — [Zone 2: 1 single-line nav link: Apresentação & Drive] — [Zone 3: 1 primary action]
      */}
      <header className="relative z-40 bg-white border-b border-neutral-200 shrink-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single element brand wordmark */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              goToStage(0);
            }}
            className="flex items-center gap-2.5 shrink-0 whitespace-nowrap group"
          >
            <LZLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
            <span className="font-display font-black text-sm tracking-widest text-black uppercase">
              LZ CONSULT
            </span>
          </a>

          {/* Zone 2: Aba Apresentação & Drive */}
          <nav className="flex items-center gap-6 text-xs font-bold text-black uppercase tracking-wider">
            <a
              href="#apresentacao-drive"
              onClick={(e) => {
                e.preventDefault();
                goToStage(1);
              }}
              className="text-black border-b-2 border-black pb-0.5 whitespace-nowrap shrink-0 hover:opacity-70 transition-opacity"
            >
              Apresentação & Drive
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={canvaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all whitespace-nowrap shrink-0 shadow-sm"
            >
              <span>Abrir no Canva</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* STATIONARY STAGE VIEWPORT: Pages rise smoothly upward in place */}
      <main className="relative flex-1 w-full bg-white overflow-hidden">
        {/* Three.js Waving Half-Body Stick Figure on the lateral edge of the screen */}
        <StickmanWave3D
          activeStage={activeStage}
          onSelectCases={() => goToStage(2)}
        />

        {/* Subtle Lateral Stage Navigation Controls (Left Side) */}
        <div className="fixed left-5 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-center gap-2.5">
          {[
            { idx: 0, label: "Início 3D" },
            { idx: 1, label: "Apresentação & Drive" },
            { idx: 2, label: "Cases de Sucesso" },
          ].map((step) => (
            <button
              key={step.idx}
              onClick={() => goToStage(step.idx)}
              aria-label={step.label}
              title={step.label}
              className={`w-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeStage === step.idx
                  ? "h-8 bg-black"
                  : "h-2.5 bg-neutral-300 hover:bg-neutral-500"
              }`}
            />
          ))}
        </div>

        {/* ============================================================
            PARTE 1: APRESENTAÇÃO DA LOGO LZ EM 3D GIRANDO NO CENTRO
           ============================================================ */}
        <motion.section
          id="inicio"
          ref={(el) => {
            stageRefs.current[0] = el as HTMLDivElement | null;
          }}
          initial={false}
          animate={{
            y: `${(0 - activeStage) * 100}%`,
            scale: activeStage === 0 ? 1 : 0.95,
            opacity: activeStage === 0 ? 1 : 0,
          }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          style={{ pointerEvents: activeStage === 0 ? "auto" : "none" }}
          className="absolute inset-0 w-full h-full bg-white no-scrollbar overflow-y-auto flex flex-col items-center justify-center px-4 sm:px-6 py-8"
        >
          <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center">
            {/* 3D Spinning LZ Logo */}
            <div className="mb-6">
              <LZLogo3D sizeClass="w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60" />
            </div>

            {/* Geometric Monochrome Separator */}
            <div className="flex items-center justify-center mb-4">
              <div className="h-[2px] w-8 bg-black" />
              <div className="mx-3 h-2.5 w-2.5 border-2 border-black rotate-45 bg-black" />
              <div className="h-[2px] w-8 bg-black" />
            </div>

            {/* Brand Title & Subtitle */}
            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tighter uppercase leading-none mb-3 text-black">
              LZ CONSULT
            </h1>

            <p className="text-xs sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.28em] uppercase font-bold text-neutral-600">
              Consultoria de marketing para você.
            </p>

            {/* Unboxed Metadata */}
            <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
              <span>MARKETING STRATEGY</span>
              <span aria-hidden="true">·</span>
              <span>PORTFÓLIO 2026</span>
            </div>

            {/* Trigger Stage 2 Rise */}
            <button
              onClick={() => goToStage(1)}
              className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-300 hover:border-black bg-white hover:bg-black hover:text-white text-black text-xs font-bold transition-all whitespace-nowrap shrink-0 group cursor-pointer"
            >
              <span>Subir Apresentação & Drive</span>
              <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>
        </motion.section>

        {/* ============================================================
            PARTE 2: LINKS CANVA E GOOGLE DRIVE (SOBE SUAVEMENTE)
           ============================================================ */}
        <motion.section
          id="apresentacao-drive"
          ref={(el) => {
            stageRefs.current[1] = el as HTMLDivElement | null;
          }}
          initial={false}
          animate={{
            y: `${(1 - activeStage) * 100}%`,
            scale: activeStage === 1 ? 1 : 0.95,
            opacity: activeStage === 1 ? 1 : 0,
          }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          style={{ pointerEvents: activeStage === 1 ? "auto" : "none" }}
          className="absolute inset-0 w-full h-full bg-white no-scrollbar overflow-y-auto flex flex-col justify-center px-4 sm:px-6 py-10"
        >
          <div className="max-w-6xl mx-auto w-full my-auto">
            <div className="max-w-2xl mx-auto text-center mb-8 space-y-1.5">
              <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold">
                <span>01</span>
                <span aria-hidden="true">·</span>
                <span>MATERIAIS ESTRATÉGICOS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-black uppercase">
                Apresentação & Drive
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Acesse a apresentação interativa desenvolvida no Canva ou navegue pelo repositório completo de projetos no Google Drive.
              </p>
            </div>

            <PortfolioHub />

            {/* Stage Transition Controls */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => goToStage(0)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-200 hover:border-black text-xs font-bold text-neutral-600 hover:text-black transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Voltar à Logo 3D</span>
              </button>
              <button
                onClick={() => goToStage(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Ver Cases de Sucesso</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.section>

        {/* ============================================================
            PARTE 3: CASES DE SUCESSO (INSTAGRAM) (SOBE SUAVEMENTE)
           ============================================================ */}
        <motion.section
          id="cases-sucesso"
          ref={(el) => {
            stageRefs.current[2] = el as HTMLDivElement | null;
          }}
          initial={false}
          animate={{
            y: `${(2 - activeStage) * 100}%`,
            scale: activeStage === 2 ? 1 : 0.95,
            opacity: activeStage === 2 ? 1 : 0,
          }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          style={{ pointerEvents: activeStage === 2 ? "auto" : "none" }}
          className="absolute inset-0 w-full h-full bg-white no-scrollbar overflow-y-auto flex flex-col justify-between px-4 sm:px-6 pt-8 pb-6"
        >
          <div className="my-auto py-4">
            <SuccessCases />

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => goToStage(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-300 hover:border-black text-xs font-bold text-black transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Voltar para Apresentação & Drive</span>
              </button>
            </div>
          </div>

          {/* PURE WHITE MONOCHROME FOOTER INSIDE FINAL STAGE */}
          <footer className="bg-white text-black border-t border-neutral-200 pt-6 mt-8 shrink-0">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <LZLogo className="w-7 h-7" />
                  <div>
                    <span className="font-display font-black text-xs tracking-tight text-black uppercase block">
                      LZ CONSULT
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      Consultoria de Marketing
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-neutral-600">
                  <a
                    href={canvaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-black transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    <span>Apresentação Canva</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-black transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    <span>Google Drive</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => goToStage(0)}
                    className="hover:text-black transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Início 3D
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 text-[11px] text-neutral-500 font-mono">
                <div>© 2026 LZ CONSULT. Todos os direitos reservados.</div>
                <div>MARKETING STRATEGY · PORTFÓLIO</div>
              </div>
            </div>
          </footer>
        </motion.section>
      </main>
    </div>
  );
}
