import React, { useRef, useState, useEffect } from 'react';
import { Plan } from '../types';
import { RESIDENTIAL_PLANS } from '../data/mockData';
import { ArrowDown, ArrowUp, Wifi, ChevronLeft, ChevronRight } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (plan: Plan) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      // Estimate current active card for dots
      const cardWidth = clientWidth * 0.85;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(index, 0), RESIDENTIAL_PLANS.length - 1));
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.85;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollToIndex = (idx: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const card = container.children[idx] as HTMLElement;
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  };

  return (
    <section id="planos" className="py-20 bg-white relative scroll-mt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1f0d38] tracking-tight">
            Escolha o seu plano Nova
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Velocidades surpreendentes para jogar, trabalhar e transmitir conteúdos em 4K
            simultâneos com estabilidade absoluta.
          </p>

          {/* Mobile Arrows Controls Bar */}
          <div className="flex md:hidden items-center justify-between mt-6 px-2">
            <span className="text-xs font-bold text-purple-900/70 flex items-center gap-1.5">
              <span>Arraste ou use as setas para ver os planos</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Plano anterior"
                className="w-10 h-10 rounded-full bg-purple-50 border border-purple-200 text-[#7738b5] flex items-center justify-center shadow-sm disabled:opacity-35 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer hover:bg-purple-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Próximo plano"
                className="w-10 h-10 rounded-full bg-[#e6007e] text-white flex items-center justify-center shadow-md disabled:opacity-35 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer hover:bg-[#b50063]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Cards Carousel Container: flex-nowrap + overflow-x-auto on mobile, grid on md+ */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch overflow-x-auto md:overflow-visible pb-6 md:pb-0 snap-x snap-mandatory scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Card 1: 800MB Plano Basic */}
          <div className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center shrink-0 md:shrink bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between border border-purple-100 h-full">
            <div className="bg-[#7738b5] text-white py-8 px-6 text-center flex flex-col items-center justify-center min-h-[150px]">
              <div className="mb-3">
                <Wifi className="w-10 h-10 opacity-90 mx-auto" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-none">
                800MB
              </h3>
              <span className="text-xs font-semibold tracking-wider uppercase text-purple-100 mt-2 opacity-90">
                Plano Basic
              </span>
            </div>

            <div className="p-6 flex flex-col items-center flex-1 justify-between bg-white">
              <div className="w-full flex flex-col items-center flex-1">
                <div className="flex flex-col gap-2 items-center mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3ecfa] text-[#7738b5] text-[11px] font-bold tracking-wide">
                    <ArrowDown className="w-3 h-3" />
                    <span>800MB DOWNLOAD</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3ecfa] text-[#7738b5] text-[11px] font-bold tracking-wide">
                    <ArrowUp className="w-3 h-3" />
                    <span>400MB UPLOAD</span>
                  </div>
                </div>

                <div className="w-full text-center mb-6 flex-1 flex flex-col">
                  <h4 className="text-sm font-extrabold text-slate-900 mb-2.5">Serviços inclusos</h4>
                  <div className="flex flex-col items-center justify-center gap-1.5 min-h-[96px]">
                    <span className="px-4 py-1 rounded-full bg-[#7738b5] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                      POUPANET
                    </span>
                    <span className="px-4 py-1 rounded-full bg-[#7738b5] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                      WI-FI ALTO ALCANCE
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full text-center pt-5 border-t border-slate-100 mt-auto">
                <div className="text-xs font-bold text-slate-700 mb-1">Com fidelidade</div>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-2xl font-black text-[#1e1b4b]">R$</span>
                  <span className="text-4xl font-black text-[#1e1b4b] tabular-nums">105,90</span>
                  <span className="text-xs font-bold text-slate-500">/mês</span>
                </div>

                <div className="flex flex-col items-center gap-1 mb-5 min-h-[76px] justify-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ede5f7] text-[#7738b5] text-[10px] font-extrabold tracking-wider uppercase">
                    MELHOR CUSTO-BENEFÍCIO
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f4effa] text-[#7738b5] text-[10px] font-bold uppercase">
                    PREÇO GARANTIDO POR 12 MESES
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f4effa] text-[#7738b5] text-[10px] font-bold uppercase">
                    ECONOMIA DE R$ 240,00
                  </span>
                </div>

                <button
                  onClick={() => onSelectPlan(RESIDENTIAL_PLANS[0])}
                  className="block w-full py-3.5 px-4 rounded-full bg-[#0a2540] hover:bg-[#153456] text-white text-xs font-black tracking-wider uppercase shadow-md hover:shadow-lg active:scale-95 transition-all text-center cursor-pointer"
                >
                  ASSINE COM FIDELIDADE
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: 800MB + NovaEduca */}
          <div className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center shrink-0 md:shrink bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between border border-purple-100 h-full">
            <div className="bg-[#a3084e] text-white py-8 px-6 text-center flex flex-col items-center justify-center relative min-h-[150px]">
              <div className="mb-3">
                <Wifi className="w-10 h-10 opacity-90 mx-auto" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-none">
                800MB
              </h3>
              <span className="text-xs font-semibold tracking-wider uppercase text-pink-300 mt-2 opacity-90">
                + NovaEduca
              </span>
            </div>

            <div className="p-6 flex flex-col items-center flex-1 justify-between bg-white">
              <div className="w-full flex flex-col items-center flex-1">
                <div className="flex flex-col gap-2 items-center mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcedf4] text-[#a3084e] text-[11px] font-bold tracking-wide">
                    <ArrowDown className="w-3 h-3" />
                    <span>800MB DOWNLOAD</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcedf4] text-[#a3084e] text-[11px] font-bold tracking-wide">
                    <ArrowUp className="w-3 h-3" />
                    <span>400MB UPLOAD</span>
                  </div>
                </div>

                <div className="w-full text-center mb-6 flex-1 flex flex-col">
                  <h4 className="text-sm font-extrabold text-slate-900 mb-2.5">Serviços inclusos</h4>
                  <div className="flex flex-col items-center justify-center gap-1.5 min-h-[96px]">
                    <span className="px-4 py-1 rounded-full bg-[#e6007e] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                      NOVAEDUCA
                    </span>
                    <span className="px-4 py-1 rounded-full bg-[#d61d68] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                      CURSOS CERTIFICADOS
                    </span>
                    <span className="px-4 py-1 rounded-full bg-[#e6007e] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                      POUPANET
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full text-center pt-5 border-t border-slate-100 mt-auto">
                <div className="text-xs font-bold text-slate-700 mb-1">Com fidelidade</div>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-2xl font-black text-[#1e1b4b]">R$</span>
                  <span className="text-4xl font-black text-[#1e1b4b] tabular-nums">135,90</span>
                  <span className="text-xs font-bold text-slate-500">/mês</span>
                </div>

                <div className="flex flex-col items-center gap-1 mb-5 min-h-[76px] justify-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ede5f7] text-[#7738b5] text-[10px] font-extrabold tracking-wider uppercase">
                    MELHOR CUSTO-BENEFÍCIO
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f4effa] text-[#7738b5] text-[10px] font-bold uppercase">
                    PREÇO GARANTIDO POR 12 MESES
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f4effa] text-[#7738b5] text-[10px] font-bold uppercase">
                    ECONOMIA DE R$ 240,00
                  </span>
                </div>

                <button
                  onClick={() => onSelectPlan(RESIDENTIAL_PLANS[1])}
                  className="block w-full py-3.5 px-4 rounded-full bg-[#0a2540] hover:bg-[#153456] text-white text-xs font-black tracking-wider uppercase shadow-md hover:shadow-lg active:scale-95 transition-all text-center cursor-pointer"
                >
                  ASSINE COM FIDELIDADE
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: 800MB + Seguro */}
          <div className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center shrink-0 md:shrink bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between border border-purple-100 h-full">
            <div className="bg-[#52178e] text-white py-8 px-6 text-center flex flex-col items-center justify-center min-h-[150px]">
              <div className="mb-3">
                <Wifi className="w-10 h-10 opacity-90 mx-auto" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-none">
                800MB
              </h3>
              <span className="text-xs font-semibold tracking-wider uppercase text-purple-100 mt-2 opacity-90">
                + Seguro
              </span>
            </div>

            <div className="p-6 flex flex-col items-center flex-1 justify-between bg-white">
              <div className="w-full flex flex-col items-center flex-1">
                <div className="flex flex-col gap-2 items-center mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3ecfa] text-[#7738b5] text-[11px] font-bold tracking-wide">
                    <ArrowDown className="w-3 h-3" />
                    <span>800MB DOWNLOAD</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3ecfa] text-[#7738b5] text-[11px] font-bold tracking-wide">
                    <ArrowUp className="w-3 h-3" />
                    <span>400MB UPLOAD</span>
                  </div>
                </div>

                <div className="w-full text-center mb-6 flex-1 flex flex-col">
                  <h4 className="text-sm font-extrabold text-slate-900 mb-2.5">Serviços inclusos</h4>
                  <div className="flex flex-col items-center justify-center gap-1.5 min-h-[96px]">
                    <span className="px-3 py-1 rounded-full bg-[#52178e] text-white text-[10px] font-bold uppercase tracking-wide text-center shadow-sm">
                      3 MESES ISENÇÃO DEMISSÃO
                    </span>
                    <span className="px-4 py-1 rounded-full bg-[#7738b5] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                      POUPANET
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full text-center pt-5 border-t border-slate-100 mt-auto">
                <div className="text-xs font-bold text-slate-700 mb-1">Com fidelidade</div>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-2xl font-black text-[#1e1b4b]">R$</span>
                  <span className="text-4xl font-black text-[#1e1b4b] tabular-nums">109,90</span>
                  <span className="text-xs font-bold text-slate-500">/mês</span>
                </div>

                <div className="flex flex-col items-center gap-1 mb-5 min-h-[76px] justify-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ede5f7] text-[#7738b5] text-[10px] font-extrabold tracking-wider uppercase">
                    MELHOR CUSTO-BENEFÍCIO
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f4effa] text-[#7738b5] text-[10px] font-bold uppercase">
                    PREÇO GARANTIDO POR 12 MESES
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f4effa] text-[#7738b5] text-[10px] font-bold uppercase">
                    ECONOMIA DE R$ 240,00
                  </span>
                </div>

                <button
                  onClick={() => onSelectPlan(RESIDENTIAL_PLANS[2])}
                  className="block w-full py-3.5 px-4 rounded-full bg-[#0a2540] hover:bg-[#153456] text-white text-xs font-black tracking-wider uppercase shadow-md hover:shadow-lg active:scale-95 transition-all text-center cursor-pointer"
                >
                  ASSINE COM FIDELIDADE
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: 800MB Cine PRO (Novo Plano Premium) */}
          <div className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center shrink-0 md:shrink bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between border-2 border-[#e6007e] relative md:-translate-y-2 shadow-glow-magenta h-full">
            {/* Tag Ganhe / Destaque */}
            <div className="absolute top-3 right-3 z-10">
              <span className="px-3 py-1 rounded-full bg-[#e6007e] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                GANHE STREAMING
              </span>
            </div>

            <div className="bg-gradient-to-br from-[#120720] via-[#3b0764] to-[#e6007e] text-white py-8 px-6 text-center flex flex-col items-center justify-center min-h-[150px] relative">
              <div className="mb-3">
                <Wifi className="w-10 h-10 opacity-90 mx-auto text-pink-300" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-none">
                800MB
              </h3>
              <span className="text-xs font-black tracking-wider uppercase text-pink-300 mt-2">
                Cine PRO
              </span>
            </div>

            <div className="p-6 flex flex-col items-center flex-1 justify-between bg-white">
              <div className="w-full flex flex-col items-center flex-1">
                <div className="flex flex-col gap-2 items-center mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcedf4] text-[#a3084e] text-[11px] font-bold tracking-wide">
                    <ArrowDown className="w-3 h-3" />
                    <span>800MB DOWNLOAD</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcedf4] text-[#a3084e] text-[11px] font-bold tracking-wide">
                    <ArrowUp className="w-3 h-3" />
                    <span>400MB UPLOAD</span>
                  </div>
                </div>

                <div className="w-full text-center mb-6 flex-1 flex flex-col">
                  <div className="mb-2">
                    <span className="text-[11px] font-extrabold text-[#e6007e] uppercase tracking-wider">
                      Ganhe
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                      PARAMOUNT+
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-purple-900 text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                      MAX (HBO)
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 mb-2">Serviço(s) incluso(s)</h4>
                  <div className="flex flex-col items-center justify-center gap-1.5 min-h-[96px]">
                    <span className="px-3.5 py-1 rounded-full bg-[#e6007e] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                      PARAMOUNT+ &amp; MAX
                    </span>
                    <span className="px-3.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                      CINE &amp; SÉRIES STREAMING
                    </span>
                    <span className="px-3.5 py-1 rounded-full bg-[#7738b5] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                      POUPANET &amp; WI-FI ALTO ALCANCE
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full text-center pt-5 border-t border-slate-100 mt-auto">
                <div className="text-xs font-bold text-slate-700 mb-1">Com fidelidade</div>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-2xl font-black text-[#1e1b4b]">R$</span>
                  <span className="text-4xl font-black text-[#1e1b4b] tabular-nums">159,90</span>
                  <span className="text-xs font-bold text-slate-500">/mês</span>
                </div>

                <div className="flex flex-col items-center gap-1 mb-5 min-h-[76px] justify-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ede5f7] text-[#7738b5] text-[10px] font-extrabold tracking-wider uppercase">
                    MELHOR CUSTO-BENEFÍCIO
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f4effa] text-[#7738b5] text-[10px] font-bold uppercase">
                    PREÇO GARANTIDO POR 12 MESES
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f4effa] text-[#7738b5] text-[10px] font-bold uppercase">
                    ECONOMIA DE R$ 240,00
                  </span>
                </div>

                <button
                  onClick={() => onSelectPlan(RESIDENTIAL_PLANS[3])}
                  className="block w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-[#e6007e] to-[#7928ca] hover:from-[#c2006a] hover:to-[#631fa8] text-white text-xs font-black tracking-wider uppercase shadow-md hover:shadow-lg active:scale-95 transition-all text-center cursor-pointer"
                >
                  ASSINE COM FIDELIDADE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Page Indicator Dots & Bottom Arrows */}
        <div className="flex md:hidden flex-col items-center gap-3 mt-4">
          <div className="flex items-center gap-2">
            {RESIDENTIAL_PLANS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToIndex(idx)}
                aria-label={`Ir para o plano ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  activeIndex === idx
                    ? 'w-6 h-2 bg-[#e6007e]'
                    : 'w-2 h-2 bg-purple-200 hover:bg-purple-300'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold bg-purple-50 text-[#7738b5] border border-purple-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <span className="text-xs font-bold text-slate-500">
              {activeIndex + 1} de {RESIDENTIAL_PLANS.length}
            </span>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold bg-[#e6007e] text-white shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
