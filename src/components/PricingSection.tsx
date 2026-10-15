import React from 'react';
import { Plan } from '../types';
import { RESIDENTIAL_PLANS } from '../data/mockData';
import { ArrowDown, ArrowUp, Wifi } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (plan: Plan) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  return (
    <section id="planos" className="py-20 bg-white relative scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1f0d38] tracking-tight">
            Escolha o seu plano Nova
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Velocidades surpreendentes para jogar, trabalhar e transmitir conteúdos em 4K
            simultâneos com estabilidade absoluta.
          </p>
        </div>

        {/* Cards Grid: 3 cards matching Image 4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Card 1: 800MB Plano Basic */}
          <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between border border-purple-100 h-full">
            <div className="bg-[#7738b5] text-white py-8 px-8 text-center flex flex-col items-center justify-center min-h-[150px]">
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

            <div className="p-8 flex flex-col items-center flex-1 justify-between bg-white">
              <div className="w-full flex flex-col items-center flex-1">
                <div className="flex flex-col gap-2.5 items-center mb-8">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f3ecfa] text-[#7738b5] text-xs font-bold tracking-wide">
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>800MB DOWNLOAD</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f3ecfa] text-[#7738b5] text-xs font-bold tracking-wide">
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>400MB UPLOAD</span>
                  </div>
                </div>

                <div className="w-full text-center mb-8 flex-1 flex flex-col">
                  <h4 className="text-base font-extrabold text-slate-900 mb-3">Serviços inclusos</h4>
                  <div className="flex flex-col items-center justify-center gap-2 min-h-[96px]">
                    <span className="px-5 py-1.5 rounded-full bg-[#7738b5] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                      POUPANET
                    </span>
                    <span className="px-5 py-1.5 rounded-full bg-[#7738b5] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                      WI-FI ALTO ALCANCE
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full text-center pt-6 border-t border-slate-100 mt-auto">
                <div className="text-xs font-bold text-slate-700 mb-1">Com fidelidade</div>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-2xl font-black text-[#1e1b4b]">R$</span>
                  <span className="text-4xl font-black text-[#1e1b4b] tabular-nums">105,90</span>
                  <span className="text-xs font-bold text-slate-500">/mês</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 mb-6 min-h-[76px] justify-center">
                  <span className="px-3 py-1 rounded-full bg-[#ede5f7] text-[#7738b5] text-[10px] font-extrabold tracking-wider uppercase">
                    MELHOR CUSTO-BENEFÍCIO
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#f4effa] text-[#7738b5] text-[10px] font-bold uppercase">
                    PREÇO GARANTIDO POR 12 MESES
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#f4effa] text-[#7738b5] text-[10px] font-bold uppercase">
                    ECONOMIA DE R$ 240,00
                  </span>
                </div>

                <button
                  onClick={() => onSelectPlan(RESIDENTIAL_PLANS[0])}
                  className="block w-full py-3.5 px-6 rounded-full bg-[#0a2540] hover:bg-[#153456] text-white text-xs font-black tracking-wider uppercase shadow-md hover:shadow-lg active:scale-95 transition-all text-center cursor-pointer"
                >
                  ASSINE COM FIDELIDADE
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: 800MB + NovaEduca (Mais Vendido) */}
          <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between border-2 border-[#e6007e] relative md:-translate-y-2 shadow-glow-magenta h-full">
            <div className="bg-[#a3084e] text-white py-8 px-8 text-center flex flex-col items-center justify-center relative min-h-[150px]">
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

            <div className="p-8 flex flex-col items-center flex-1 justify-between bg-white">
              <div className="w-full flex flex-col items-center flex-1">
                <div className="flex flex-col gap-2.5 items-center mb-8">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fcedf4] text-[#a3084e] text-xs font-bold tracking-wide">
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>800MB DOWNLOAD</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fcedf4] text-[#a3084e] text-xs font-bold tracking-wide">
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>400MB UPLOAD</span>
                  </div>
                </div>

                <div className="w-full text-center mb-8 flex-1 flex flex-col">
                  <h4 className="text-base font-extrabold text-slate-900 mb-3">Serviços inclusos</h4>
                  <div className="flex flex-col items-center justify-center gap-2 min-h-[96px]">
                    <span className="px-5 py-1.5 rounded-full bg-[#e6007e] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                      NOVAEDUCA
                    </span>
                    <span className="px-5 py-1.5 rounded-full bg-[#d61d68] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                      CURSOS CERTIFICADOS
                    </span>
                    <span className="px-5 py-1.5 rounded-full bg-[#e6007e] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                      POUPANET
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full text-center pt-6 border-t border-slate-100 mt-auto">
                <div className="text-xs font-bold text-slate-700 mb-1">Com fidelidade</div>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-2xl font-black text-[#1e1b4b]">R$</span>
                  <span className="text-4xl font-black text-[#1e1b4b] tabular-nums">135,90</span>
                  <span className="text-xs font-bold text-slate-500">/mês</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 mb-6 min-h-[76px] justify-center">
                  <span className="px-3 py-1 rounded-full bg-[#ede5f7] text-[#7738b5] text-[10px] font-extrabold tracking-wider uppercase">
                    MELHOR CUSTO-BENEFÍCIO
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#f4effa] text-[#7738b5] text-[10px] font-bold uppercase">
                    PREÇO GARANTIDO POR 12 MESES
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#f4effa] text-[#7738b5] text-[10px] font-bold uppercase">
                    ECONOMIA DE R$ 240,00
                  </span>
                </div>

                <button
                  onClick={() => onSelectPlan(RESIDENTIAL_PLANS[1])}
                  className="block w-full py-3.5 px-6 rounded-full bg-[#0a2540] hover:bg-[#153456] text-white text-xs font-black tracking-wider uppercase shadow-md hover:shadow-lg active:scale-95 transition-all text-center cursor-pointer"
                >
                  ASSINE COM FIDELIDADE
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: 800MB + Seguro */}
          <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between border border-purple-100 h-full">
            <div className="bg-[#52178e] text-white py-8 px-8 text-center flex flex-col items-center justify-center min-h-[150px]">
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

            <div className="p-8 flex flex-col items-center flex-1 justify-between bg-white">
              <div className="w-full flex flex-col items-center flex-1">
                <div className="flex flex-col gap-2.5 items-center mb-8">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f3ecfa] text-[#7738b5] text-xs font-bold tracking-wide">
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>800MB DOWNLOAD</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#f3ecfa] text-[#7738b5] text-xs font-bold tracking-wide">
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>400MB UPLOAD</span>
                  </div>
                </div>

                <div className="w-full text-center mb-8 flex-1 flex flex-col">
                  <h4 className="text-base font-extrabold text-slate-900 mb-3">Serviços inclusos</h4>
                  <div className="flex flex-col items-center justify-center gap-2 min-h-[96px]">
                    <span className="px-4 py-1.5 rounded-full bg-[#52178e] text-white text-[11px] font-bold uppercase tracking-wide text-center shadow-sm">
                      3 MESES DE ISENÇÃO EM CASO DE DEMISSÃO
                    </span>
                    <span className="px-5 py-1.5 rounded-full bg-[#7738b5] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                      POUPANET
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full text-center pt-6 border-t border-slate-100 mt-auto">
                <div className="text-xs font-bold text-slate-700 mb-1">Com fidelidade</div>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-2xl font-black text-[#1e1b4b]">R$</span>
                  <span className="text-4xl font-black text-[#1e1b4b] tabular-nums">109,90</span>
                  <span className="text-xs font-bold text-slate-500">/mês</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 mb-6 min-h-[76px] justify-center">
                  <span className="px-3 py-1 rounded-full bg-[#ede5f7] text-[#7738b5] text-[10px] font-extrabold tracking-wider uppercase">
                    MELHOR CUSTO-BENEFÍCIO
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#f4effa] text-[#7738b5] text-[10px] font-bold uppercase">
                    PREÇO GARANTIDO POR 12 MESES
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#f4effa] text-[#7738b5] text-[10px] font-bold uppercase">
                    ECONOMIA DE R$ 240,00
                  </span>
                </div>

                <button
                  onClick={() => onSelectPlan(RESIDENTIAL_PLANS[2])}
                  className="block w-full py-3.5 px-6 rounded-full bg-[#0a2540] hover:bg-[#153456] text-white text-xs font-black tracking-wider uppercase shadow-md hover:shadow-lg active:scale-95 transition-all text-center cursor-pointer"
                >
                  ASSINE COM FIDELIDADE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
