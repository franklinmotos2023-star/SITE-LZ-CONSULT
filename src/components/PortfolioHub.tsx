import React, { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";

// Canva Brand Logo with the user's exact URL & dimensions
export const CanvaBrandLogo: React.FC<{ className?: string }> = ({
  className = "w-[115px] h-[65px]",
}) => (
  <img
    src="https://cdn.brandfetch.io/id9mVQlyB1/theme/dark/idC6GJnZFh.svg?c=1dxbfHSJFAPEGdCLU4o5B"
    alt="Canva Presentation"
    className={`${className} object-contain transition-all duration-300 brightness-0 group-hover:invert`}
    referrerPolicy="no-referrer"
  />
);

// Google Drive Official Logo
export const GoogleDriveBrandLogo: React.FC<{ className?: string }> = ({
  className = "w-16 h-16",
}) => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg"
    alt="Google Drive"
    className={`${className} object-contain transition-all duration-300 brightness-0 group-hover:invert`}
    referrerPolicy="no-referrer"
  />
);

export const PortfolioHub: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const links = [
    {
      index: "01",
      tag: "APRESENTAÇÃO INTERATIVA",
      title: "Apresentação Portfólio",
      subtitle: "Pitch deck estratégico desenvolvido no Canva",
      description:
        "Visualize a apresentação completa de consultoria, metodologia de branding, diagnóstico de mercado e cases estratégicos.",
      url: "https://www.canva.com/design/DAG2D7eJMPI/hAnK1EWaEXChO0EjhDrmvg/view?utlId=hae901ba460%231",
      icon: <CanvaBrandLogo className="w-[115px] h-[65px]" />,
      actionText: "Abrir Apresentação",
      platform: "Canva Pro",
    },
    {
      index: "02",
      tag: "REPOSITÓRIO DE ARQUIVOS",
      title: "Portfólio Completo",
      subtitle: "Repositório corporativo no Google Drive",
      description:
        "Acesse nossa pasta na nuvem com relatórios de performance, peças gráficas, brand assets e materiais institucionais completos.",
      url: "https://drive.google.com/drive/u/1/folders/1OU6-hHnKodC33m1cKiYBYAvQbFkLypXT",
      icon: <GoogleDriveBrandLogo className="w-16 h-16" />,
      actionText: "Acessar Google Drive",
      platform: "Google Cloud",
    },
  ];

  const handleCopy = (url: string, idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full">
      {/* 2-Column High Impact Monochrome Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
        {links.map((item, idx) => (
          <div
            key={item.index}
            className="group relative bg-white border-2 border-black rounded-2xl p-7 md:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[10px_10px_0px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1 overflow-hidden"
          >
            {/* Top Bar inside Card */}
            <div className="flex items-start justify-between mb-6 z-10">
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-black text-black">
                  {item.index}
                </span>
                <span className="text-neutral-300 font-light">|</span>
                <span className="text-[11px] font-mono tracking-wider font-bold text-neutral-500 uppercase">
                  {item.tag}
                </span>
              </div>

              {/* Copy & Share Action */}
              <button
                onClick={(e) => handleCopy(item.url, idx, e)}
                className="p-2 rounded-lg border border-neutral-300 hover:border-black bg-neutral-50 hover:bg-black hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono"
                title="Copiar Link"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black font-bold" />
                    <span className="text-[10px] text-black font-bold">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-neutral-600 hover:text-white" />
                    <span className="text-[10px] text-neutral-600 hover:text-white hidden sm:inline">Copiar Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Central Icon Area */}
            <div className="my-6 py-6 flex items-center justify-center bg-neutral-50 rounded-xl border border-neutral-200 group-hover:bg-black transition-colors duration-300 min-h-[140px]">
              <div className="transition-transform duration-300 group-hover:scale-105">
                {item.icon}
              </div>
            </div>

            {/* Content & Details */}
            <div className="mt-2 space-y-2">
              <h3 className="font-display font-black text-2xl text-black transition-colors leading-tight">
                {item.title}
              </h3>
              <p className="text-xs font-mono text-neutral-500 font-medium">
                {item.subtitle}
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed pt-1">
                {item.description}
              </p>
            </div>

            {/* Primary Action Button - Centered */}
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-center">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm w-full sm:w-auto"
              >
                <span>{item.actionText}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
