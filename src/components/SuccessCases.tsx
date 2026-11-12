import React, { useState } from "react";
import { ArrowUpRight, Check, Copy, Instagram } from "lucide-react";

interface SuccessCase {
  index: string;
  handle: string;
  name: string;
  category: "INFOPRODUTOS" | "EDIÇÃO DE VÍDEO E IMAGEM" | "COORD. MARKETING" | "SOCIAL MEDIA";
  filterGroup: "coord" | "infoprodutos" | "midia";
  url: string;
  presentation: string;
  deliverables: string;
}

const SUCCESS_CASES: SuccessCase[] = [
  {
    index: "01",
    handle: "@paulinhodosleiloes",
    name: "Paulinho dos Leilões",
    category: "INFOPRODUTOS",
    filterGroup: "infoprodutos",
    url: "https://www.instagram.com/paulinhodosleiloes/",
    presentation:
      "Estruturação estratégica de infoprodutos, posicionamento de autoridade e funil de conversão digital para escalar vendas no nicho de leilões.",
    deliverables: "Funil de Lançamento · Oferta & Copy · Tráfego & Retenção",
  },
  {
    index: "02",
    handle: "@futcearense",
    name: "Fut Cearense",
    category: "EDIÇÃO DE VÍDEO E IMAGEM",
    filterGroup: "midia",
    url: "https://www.instagram.com/futcearense/",
    presentation:
      "Pós-produção audiovisual dinâmica, edição de cortes de alto impacto e design de peças esportivas otimizadas para retenção e alcance.",
    deliverables: "Reels & Motion · Tratamento Visual · Identidade Esportiva",
  },
  {
    index: "03",
    handle: "@novojovem.ce",
    name: "Novo Jovem CE",
    category: "COORD. MARKETING",
    filterGroup: "coord",
    url: "https://www.instagram.com/novojovem.ce/",
    presentation:
      "Coordenação completa de marketing, alinhamento de narrativa institucional e planejamento de campanhas para engajamento regional.",
    deliverables: "Direção Estratégica · Planejamento · Gestão de Campanhas",
  },
  {
    index: "04",
    handle: "@marcaodaema",
    name: "Marcão da EMA",
    category: "SOCIAL MEDIA",
    filterGroup: "midia",
    url: "https://www.instagram.com/marcaodaema/",
    presentation:
      "Gestão editorial contínua de redes sociais, construção de linha criativa autêntica e otimização de frequência para crescimento orgânico.",
    deliverables: "Calendário Editorial · Conteúdo Diário · Comunidade",
  },
  {
    index: "05",
    handle: "@vozaocast_",
    name: "Vozão Cast",
    category: "COORD. MARKETING",
    filterGroup: "coord",
    url: "https://www.instagram.com/vozaocast_/",
    presentation:
      "Coordenação de marketing para ecossistema de podcast, estratégia de distribuição multiplataforma e ampliação de audiência recorrente.",
    deliverables: "Distribuição · Posicionamento · Crescimento de Canal",
  },
  {
    index: "06",
    handle: "@franklin.motos",
    name: "Franklin Motos",
    category: "COORD. MARKETING",
    filterGroup: "coord",
    url: "https://www.instagram.com/franklin.motos/",
    presentation:
      "Coordenação de marketing comercial focada em geração de demanda qualificada, fortalecimento de marca local e conversão de vendas.",
    deliverables: "Marketing Comercial · Captação de Leads · Branding Local",
  },
];

export const SuccessCases: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "coord" | "infoprodutos" | "midia">("all");
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const filteredCases =
    filter === "all"
      ? SUCCESS_CASES
      : SUCCESS_CASES.filter((item) => item.filterGroup === filter);

  const handleCopy = (url: string, index: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header & Interactive Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 mb-8 border-b border-neutral-200">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold">
            <span>02</span>
            <span aria-hidden="true">·</span>
            <span>RESULTADOS & ATUAÇÃO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-black uppercase">
            Cases de Sucesso
          </h2>
          <p className="text-sm text-neutral-600 max-w-xl leading-relaxed">
            Perfis e projetos conduzidos com estratégia, coordenação criativa, edição audiovisual e gestão orientada a crescimento.
          </p>
        </div>

        {/* Interactive Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-neutral-100 rounded-xl border border-neutral-200 shrink-0">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              filter === "all"
                ? "bg-black text-white shadow-sm"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            Todos (6)
          </button>
          <button
            onClick={() => setFilter("coord")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              filter === "coord"
                ? "bg-black text-white shadow-sm"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            Coord. Marketing (3)
          </button>
          <button
            onClick={() => setFilter("infoprodutos")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              filter === "infoprodutos"
                ? "bg-black text-white shadow-sm"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            Infoprodutos (1)
          </button>
          <button
            onClick={() => setFilter("midia")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              filter === "midia"
                ? "bg-black text-white shadow-sm"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            Social & Edição (2)
          </button>
        </div>
      </div>

      {/* 3-Column Responsive Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((item) => (
          <div
            key={item.index}
            className="group bg-white border-2 border-black rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[8px_8px_0px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            <div>
              {/* Top Unboxed Metadata + Copy Link */}
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-black uppercase tracking-wider truncate">
                  <span>{item.index}</span>
                  <span aria-hidden="true" className="text-neutral-300">
                    ·
                  </span>
                  <span className="truncate text-neutral-700">{item.category}</span>
                </div>

                <button
                  onClick={(e) => handleCopy(item.url, item.index, e)}
                  className="p-1.5 rounded-lg border border-neutral-300 hover:border-black bg-neutral-50 hover:bg-black hover:text-white transition-all flex items-center gap-1 shrink-0"
                  title="Copiar link do Instagram"
                  aria-label={`Copiar link de ${item.name}`}
                >
                  {copiedIndex === item.index ? (
                    <Check className="w-3.5 h-3.5 text-black group-hover:text-current" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Account Identity Block */}
              <div className="mt-5 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-200 group-hover:bg-black group-hover:border-black group-hover:text-white transition-colors duration-300 flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-black text-lg text-black leading-tight truncate">
                    {item.name}
                  </h3>
                  <p className="font-mono text-xs text-neutral-500 truncate mt-0.5">
                    {item.handle}
                  </p>
                </div>
              </div>

              {/* Presentation Description */}
              <p className="mt-4 text-sm text-neutral-700 leading-relaxed">
                {item.presentation}
              </p>

              {/* Quiet Unboxed Deliverables Line */}
              <p className="mt-4 text-[11px] font-mono text-neutral-500 border-t border-neutral-100 pt-3">
                {item.deliverables}
              </p>
            </div>

            {/* Action Link */}
            <div className="mt-5 pt-3">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all whitespace-nowrap shrink-0"
              >
                <span>Ver Perfil no Instagram</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
