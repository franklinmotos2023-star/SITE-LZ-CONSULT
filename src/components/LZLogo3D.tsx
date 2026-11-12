import React, { useState } from "react";

interface LZLogo3DProps {
  sizeClass?: string;
}

/**
 * Bug-Free Double-Sided 3D Extruded Medallion & Relief Logo
 * - Uses `backfaceVisibility: "hidden"` on all front relief layers (+Z) and rear relief layers (-Z, rotated 180° Y)
 *   so the two asymmetric "LZ" silhouettes never bleed through each other and neither side ever appears mirrored/inverted.
 * - Connects front and back with a radially symmetric 3D sculpted medallion core so the edge profile is 100% seamless at all 360° angles.
 */
export const LZLogo3D: React.FC<LZLogo3DProps> = ({
  sizeClass = "w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60",
}) => {
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });

  // 24 circular medallion core slices (-12px to +12px) forming a solid metallic-rimmed 3D coin body
  const coreSlices = Array.from({ length: 25 }, (_, idx) => {
    const z = -12 + idx * 1; // -12px to +12px
    const isRimBevel = Math.abs(z) >= 10;
    return { z, isRimBevel };
  });

  // 10 front relief slices (+12.5px to +18.5px) - strictly visible only when front faces viewer
  const reliefOffsets = Array.from({ length: 10 }, (_, idx) => 12.5 + idx * 0.65);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: -ny * 20,
      ry: nx * 24,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`lz-3d-scene relative ${sizeClass} flex items-center justify-center cursor-grab active:cursor-grabbing`}
        title="LZ Consult — Logo 3D"
      >
        {/* Interactive pointer tilt wrapper */}
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt.rx.toFixed(1)}deg) rotateY(${tilt.ry.toFixed(1)}deg)`,
          }}
        >
          {/* Continuous 360° 3D Spinning Core */}
          <div className="lz-3d-object relative w-full h-full flex items-center justify-center">
            {/* ============================================================
                1. RADIALLY SYMMETRIC 3D MEDALLION CORE (-12px to +12px)
                Ensures zero asymmetric silhouette clash when rotating 360°
               ============================================================ */}
            {coreSlices.map((slice, idx) => (
              <div
                key={`core-${idx}`}
                aria-hidden="true"
                className={`absolute inset-2 rounded-full pointer-events-none ${
                  slice.isRimBevel
                    ? "bg-white border-[4px] border-black"
                    : "bg-neutral-900 border-[4px] border-black"
                }`}
                style={{
                  transform: `translateZ(${slice.z.toFixed(2)}px)`,
                }}
              />
            ))}

            {/* Medallion Front White Face Plate (+12.2px, backface hidden) */}
            <div
              aria-hidden="true"
              className="absolute inset-2 rounded-full bg-white border-[3px] border-black shadow-inner pointer-events-none"
              style={{
                transform: "translateZ(12.2px)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            />

            {/* Medallion Back White Face Plate (-12.2px, rotated 180deg, backface hidden) */}
            <div
              aria-hidden="true"
              className="absolute inset-2 rounded-full bg-white border-[3px] border-black shadow-inner pointer-events-none"
              style={{
                transform: "translateZ(-12.2px) rotateY(180deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            />

            {/* ============================================================
                2. FRONT 3D EXTRUDED LZ LOGO RELIEF (+12.5px to +19px)
                Every layer has backfaceVisibility: hidden so it NEVER shows backwards
               ============================================================ */}
            {reliefOffsets.map((z, idx) => (
              <img
                key={`front-relief-${idx}`}
                src="https://i.imgur.com/peyGhBz.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full p-6 sm:p-7 object-contain pointer-events-none brightness-0"
                style={{
                  transform: `translateZ(${z.toFixed(2)}px)`,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
                referrerPolicy="no-referrer"
              />
            ))}

            {/* Front Top Hero Face (+19.2px) */}
            <img
              src="https://i.imgur.com/peyGhBz.png"
              alt="LZ Logo Frente"
              className="relative w-full h-full p-6 sm:p-7 object-contain pointer-events-none drop-shadow-[0_6px_10px_rgba(0,0,0,0.16)]"
              style={{
                transform: "translateZ(19.2px)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              referrerPolicy="no-referrer"
            />

            {/* ============================================================
                3. BACK 3D EXTRUDED LZ LOGO RELIEF (-12.5px to -19.2px)
                Rotated 180° around Y with backfaceVisibility: hidden so when the
                back side rotates into view, it reads "LZ" right-side-up with zero inversion!
               ============================================================ */}
            {reliefOffsets.map((z, idx) => (
              <img
                key={`back-relief-${idx}`}
                src="https://i.imgur.com/peyGhBz.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full p-6 sm:p-7 object-contain pointer-events-none brightness-0"
                style={{
                  transform: `rotateY(180deg) translateZ(${z.toFixed(2)}px)`,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
                referrerPolicy="no-referrer"
              />
            ))}

            {/* Back Top Hero Face (-19.2px, reads right-side-up when rotated 180°) */}
            <img
              src="https://i.imgur.com/peyGhBz.png"
              alt="LZ Logo Verso"
              className="absolute inset-0 w-full h-full p-6 sm:p-7 object-contain pointer-events-none drop-shadow-[0_6px_10px_rgba(0,0,0,0.16)]"
              style={{
                transform: "rotateY(180deg) translateZ(19.2px)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Multi-layered Floor Contact Shadow */}
      <div className="relative mt-6 flex flex-col items-center justify-center pointer-events-none">
        <div
          aria-hidden="true"
          className="lz-3d-ShadowFloor w-32 sm:w-44 h-3.5 rounded-full bg-black/30 blur-md"
        />
        <div
          aria-hidden="true"
          className="lz-3d-ShadowFloor -mt-2.5 w-16 sm:w-24 h-1.5 rounded-full bg-black/45 blur-[2px]"
        />
      </div>
    </div>
  );
};
