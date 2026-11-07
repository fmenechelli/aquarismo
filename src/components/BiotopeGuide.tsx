import React from 'react';
import { BIOTOPES } from '../data/speciesData';
import { Droplets, Thermometer, Sparkles, Compass, Check } from 'lucide-react';

interface BiotopeGuideProps {
  onLoadBiotope: (speciesIds: string[]) => void;
}

export function BiotopeGuide({ onLoadBiotope }: BiotopeGuideProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#f0f4f8] sm:text-2xl">
          Guias de Biótopos Naturais de Água Doce
        </h2>
        <p className="mt-1 text-sm text-[#94a3b8]">
          Replique as condições hidrológicas e botânicas exatas dos maiores ecossistemas aquáticos do mundo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {BIOTOPES.map((biotope) => (
          <article
            key={biotope.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-[#1a2c40] bg-[#121f2d] shadow-md transition-colors hover:border-[#334e68]"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0c1622]">
              <img
                src={biotope.imageUrl}
                alt={biotope.name}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121f2d] via-transparent to-transparent" />
            </div>

            <div className="flex flex-1 flex-col p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00f0ff]">
                Biótopo Clássico
              </span>
              <h3 className="mt-1 text-lg font-bold text-[#f0f4f8]">
                {biotope.name}
              </h3>
              <p className="text-xs font-medium text-[#94a3b8]">
                {biotope.subtitle}
              </p>

              <p className="mt-3 flex-1 text-xs leading-relaxed text-[#cbd5e1]">
                {biotope.description}
              </p>

              <div className="mt-4 rounded-xl border border-[#1a2c40]/80 bg-[#0a1118]/70 p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[#94a3b8]">
                    <Droplets className="h-3.5 w-3.5 text-[#38bdf8]" />
                    pH Típico:
                  </span>
                  <span className="font-semibold text-[#f0f4f8]">{biotope.typicalPh}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[#94a3b8]">
                    <Thermometer className="h-3.5 w-3.5 text-[#f87171]" />
                    Temperatura:
                  </span>
                  <span className="font-semibold text-[#f0f4f8]">{biotope.typicalTemp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94a3b8]">Dureza da Água:</span>
                  <span className="font-semibold text-[#94a3b8]">{biotope.typicalHardness}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1a2c40]/70">
                <button
                  type="button"
                  onClick={() => onLoadBiotope(biotope.recommendedSpeciesIds)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#00f0ff]/30 bg-[#00f0ff]/10 py-2.5 text-xs font-semibold text-[#00f0ff] transition-colors hover:bg-[#00f0ff]/20"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Carregar Biótopo no Simulador</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
