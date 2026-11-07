import React, { useState } from 'react';
import { Species } from '../types/aquarium';
import { Plus, Check, Info, Droplets, Thermometer, Maximize2 } from 'lucide-react';

interface SpeciesCardProps {
  species: Species;
  onOpenDetails: (species: Species) => void;
  onToggleTank: (species: Species) => void;
  isInTank: boolean;
}

export function SpeciesCard({
  species,
  onOpenDetails,
  onToggleTank,
  isInTank
}: SpeciesCardProps) {
  const [imgError, setImgError] = useState(false);
  const isFish = species.type === 'fish';
  const accentBorderHover = isFish
    ? 'hover:border-[#00f0ff]/50 focus-within:border-[#00f0ff]/60'
    : 'hover:border-[#22c55e]/50 focus-within:border-[#22c55e]/60';

  const badgeColor = isFish
    ? 'border-[#00f0ff]/20 bg-[#00f0ff]/10 text-[#00f0ff]'
    : 'border-[#22c55e]/20 bg-[#22c55e]/10 text-[#22c55e]';

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-xl border border-[#1a2c40] bg-[#121f2d] transition-all duration-200 shadow-sm hover:shadow-md ${accentBorderHover}`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0c1622]">
        {!imgError ? (
          <img
            src={species.imageUrl}
            alt={`${species.commonName} (${species.scientificName})`}
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#121f2d] to-[#0a1118] p-4 text-center">
            <span
              className={`text-xs font-semibold tracking-wider uppercase ${
                isFish ? 'text-[#00f0ff]' : 'text-[#22c55e]'
              }`}
            >
              {isFish ? 'Peixe de Água Doce' : 'Flora Botânica'}
            </span>
            <span className="mt-1 text-[11px] text-[#64748b]">
              {species.family}
            </span>
          </div>
        )}

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span
            className={`rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase ${
              isFish
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] backdrop-blur-md'
                : 'bg-[#22c55e]/20 text-[#22c55e] backdrop-blur-md'
            }`}
          >
            {isFish ? 'Fauna' : 'Flora'}
          </span>
          <span className="rounded-md bg-[#0a1118]/80 px-2 py-0.5 text-[11px] font-medium text-[#94a3b8] backdrop-blur-md">
            {species.careLevel}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpenDetails(species)}
          aria-label={`Ver detalhes de ${species.commonName}`}
          className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[#0a1118]/70 text-[#cbd5e1] opacity-0 transition-opacity hover:bg-[#00f0ff]/20 hover:text-white group-hover:opacity-100"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-[#f0f4f8]">
              {species.commonName}
            </h3>
            <p className="text-xs italic text-[#94a3b8]">
              {species.scientificName}
            </p>
          </div>
          <span className="text-[11px] text-[#64748b] shrink-0">
            {species.family}
          </span>
        </div>

        <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-[#cbd5e1]">
          {species.description}
        </p>

        {/* Technical specs strip */}
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-[#0a1118]/60 p-2.5 text-[11px]">
          <div className="flex items-center gap-1.5 text-[#94a3b8]">
            <Droplets className="h-3.5 w-3.5 shrink-0 text-[#38bdf8]" />
            <span>
              pH: <strong className="text-[#f0f4f8] tabular-nums">{species.minPh} – {species.maxPh}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#94a3b8]">
            <Thermometer className="h-3.5 w-3.5 shrink-0 text-[#f87171]" />
            <span>
              Temp: <strong className="text-[#f0f4f8] tabular-nums">{species.minTemp}° – {species.maxTemp}°C</strong>
            </span>
          </div>

          {isFish ? (
            <>
              <div className="text-[#94a3b8]">
                Tam: <strong className="text-[#f0f4f8] tabular-nums">{(species as any).maxSizeCm} cm</strong>
              </div>
              <div className="text-[#94a3b8] truncate">
                Nado: <strong className="text-[#f0f4f8]">{(species as any).swimmingLevel}</strong>
              </div>
            </>
          ) : (
            <>
              <div className="text-[#94a3b8]">
                Luz: <strong className="text-[#f0f4f8]">{(species as any).lightDemand}</strong>
              </div>
              <div className="text-[#94a3b8] truncate">
                Posição: <strong className="text-[#f0f4f8]">{(species as any).position.split(' ')[0]}</strong>
              </div>
            </>
          )}
        </div>

        {/* Tags */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {species.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className={`rounded px-2 py-0.5 text-[10px] font-medium ${badgeColor}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex items-center gap-2 border-t border-[#1a2c40]/70 pt-4">
          <button
            type="button"
            onClick={() => onOpenDetails(species)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#1a2c40] bg-[#0c1622] px-3 py-2 text-xs font-medium text-[#cbd5e1] transition-colors hover:border-[#334e68] hover:bg-[#162738] hover:text-[#f0f4f8]"
          >
            <Info className="h-3.5 w-3.5 text-[#38bdf8]" />
            <span>Ficha Técnica</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleTank(species)}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              isInTank
                ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40 hover:bg-[#ef4444]/20 hover:text-[#ef4444] hover:border-[#ef4444]/40'
                : isFish
                ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 hover:bg-[#00f0ff]/20'
                : 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30 hover:bg-[#22c55e]/20'
            }`}
            title={isInTank ? 'Remover do aquário virtual' : 'Adicionar ao aquário virtual'}
          >
            {isInTank ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">No Aquário</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Planejar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
