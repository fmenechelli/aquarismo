import React, { useEffect, useState } from 'react';
import { Species } from '../types/aquarium';
import { X, Droplets, Thermometer, Box, AlertCircle, Plus, Check, Compass, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

interface SpeciesModalProps {
  species: Species | null;
  onClose: () => void;
  onToggleTank: (species: Species) => void;
  isInTank: boolean;
}

export function SpeciesModal({
  species,
  onClose,
  onToggleTank,
  isInTank
}: SpeciesModalProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!species) return null;

  const isFish = species.type === 'fish';
  const fish = isFish ? species : null;
  const plant = !isFish ? species : null;

  // pH percentage calculation for visual bar (scale 5.0 to 8.5)
  const phMinScale = 5.0;
  const phMaxScale = 8.5;
  const phLeftPercent = Math.max(0, Math.min(100, ((species.minPh - phMinScale) / (phMaxScale - phMinScale)) * 100));
  const phWidthPercent = Math.max(8, Math.min(100 - phLeftPercent, ((species.maxPh - species.minPh) / (phMaxScale - phMinScale)) * 100));

  // Temp percentage calculation for visual bar (scale 16°C to 32°C)
  const tempMinScale = 16;
  const tempMaxScale = 32;
  const tempLeftPercent = Math.max(0, Math.min(100, ((species.minTemp - tempMinScale) / (tempMaxScale - tempMinScale)) * 100));
  const tempWidthPercent = Math.max(8, Math.min(100 - tempLeftPercent, ((species.maxTemp - species.minTemp) / (tempMaxScale - tempMinScale)) * 100));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0a1118]/80 backdrop-blur-sm transition-opacity"
      />

      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#1a2c40] bg-[#121f2d] shadow-2xl">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-[#1a2c40] px-6 py-4">
          <div className="flex items-center gap-2">
            <span
              className={`rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                isFish
                  ? 'bg-[#00f0ff]/15 text-[#00f0ff]'
                  : 'bg-[#22c55e]/15 text-[#22c55e]'
              }`}
            >
              {isFish ? 'Ficha de Ictiofauna' : 'Ficha Botânica'}
            </span>
            <span className="text-xs text-[#64748b]">·</span>
            <span className="text-xs text-[#94a3b8]">{species.origin}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar ficha técnica"
            className="rounded-lg p-1.5 text-[#94a3b8] transition-colors hover:bg-[#1a2c40] hover:text-[#f0f4f8]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 text-sm text-[#cbd5e1] space-y-6">
          {/* Top visual block */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#1a2c40] bg-[#0c1622]">
              {!imgError ? (
                <img
                  src={species.imageUrl}
                  alt={species.commonName}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-4 text-center text-xs text-[#64748b]">
                  {species.commonName}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h2 id="modal-title" className="text-2xl font-bold tracking-tight text-[#f0f4f8]">
                  {species.commonName}
                </h2>
                <p className="mt-0.5 text-sm italic text-[#94a3b8]">
                  {species.scientificName}
                </p>
                <p className="mt-1 text-xs text-[#64748b]">
                  Família: <span className="text-[#94a3b8]">{species.family}</span>
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-[#1a2c40]/80 bg-[#0a1118]/70 p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#94a3b8]">Nível de Cuidado:</span>
                  <span className="font-semibold text-[#f0f4f8]">{species.careLevel}</span>
                </div>
                {fish && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[#94a3b8]">Tamanho Adulto:</span>
                      <span className="font-semibold text-[#f0f4f8] tabular-nums">{fish.maxSizeCm} cm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#94a3b8]">Volume Mínimo:</span>
                      <span className="font-semibold text-[#00f0ff] tabular-nums">{fish.minTankLiters} Litros</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#94a3b8]">Temperamento:</span>
                      <span className="font-semibold text-[#f0f4f8]">{fish.temperament}</span>
                    </div>
                  </>
                )}
                {plant && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[#94a3b8]">Posição:</span>
                      <span className="font-semibold text-[#22c55e]">{plant.position}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#94a3b8]">Demanda de Luz:</span>
                      <span className="font-semibold text-[#f0f4f8]">{plant.lightDemand}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#94a3b8]">Injeção de CO2:</span>
                      <span className="font-semibold text-[#f0f4f8]">{plant.co2Demand}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#94a3b8]">
              Descrição Biológica
            </h4>
            <p className="mt-1.5 leading-relaxed text-[#cbd5e1]">
              {species.description}
            </p>
          </div>

          {/* Parameter Gauges */}
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#1a2c40] bg-[#0c1622] p-4 sm:grid-cols-2">
            {/* pH Gauge */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-[#f0f4f8]">
                  <Droplets className="h-3.5 w-3.5 text-[#38bdf8]" />
                  Faixa de pH Ideal
                </span>
                <span className="font-semibold text-[#38bdf8] tabular-nums">
                  {species.minPh} – {species.maxPh}
                </span>
              </div>
              <div className="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#1a2c40]">
                <div
                  className="absolute top-0 bottom-0 rounded-full bg-[#38bdf8]"
                  style={{
                    left: `${phLeftPercent}%`,
                    width: `${phWidthPercent}%`
                  }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-[#64748b] tabular-nums">
                <span>5.0 (Muito ácido)</span>
                <span>7.0 (Neutro)</span>
                <span>8.5 (Alcalino)</span>
              </div>
            </div>

            {/* Temperature Gauge */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-[#f0f4f8]">
                  <Thermometer className="h-3.5 w-3.5 text-[#f87171]" />
                  Faixa de Temperatura
                </span>
                <span className="font-semibold text-[#f87171] tabular-nums">
                  {species.minTemp}°C – {species.maxTemp}°C
                </span>
              </div>
              <div className="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#1a2c40]">
                <div
                  className="absolute top-0 bottom-0 rounded-full bg-[#f87171]"
                  style={{
                    left: `${tempLeftPercent}%`,
                    width: `${tempWidthPercent}%`
                  }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-[#64748b] tabular-nums">
                <span>16°C</span>
                <span>24°C</span>
                <span>32°C</span>
              </div>
            </div>
          </div>

          {/* Detailed biological sections */}
          {fish && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#1a2c40]/80 bg-[#0a1118]/60 p-4">
                <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#00f0ff]">
                  <Compass className="h-4 w-4" />
                  Comportamento e Compatibilidade
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[#cbd5e1]">
                  {fish.compatibilityNotes}
                </p>
                {fish.idealSchoolSize && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#00f0ff]/10 px-2.5 py-1 text-xs text-[#00f0ff]">
                    <span>Cardume recomendado: mínimo de <strong>{fish.idealSchoolSize} espécimes</strong></span>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-[#1a2c40]/80 bg-[#0a1118]/60 p-4">
                <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                  <Sparkles className="h-4 w-4 text-[#38bdf8]" />
                  Alimentação & Reprodução
                </h4>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
                  <div>
                    <span className="text-[#94a3b8]">Regime Alimentar:</span>{' '}
                    <strong className="text-[#f0f4f8]">{fish.diet}</strong>
                  </div>
                  <div>
                    <span className="text-[#94a3b8]">Zona de Nado:</span>{' '}
                    <strong className="text-[#f0f4f8]">{fish.swimmingLevel}</strong>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[#94a3b8]">
                  {fish.reproductionNotes}
                </p>
              </div>
            </div>
          )}

          {plant && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#1a2c40]/80 bg-[#0a1118]/60 p-4">
                <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#22c55e]">
                  <BookOpen className="h-4 w-4" />
                  Manejo Botânico & Propagação
                </h4>
                <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs">
                  <div>
                    <span className="text-[#94a3b8]">Taxa de Crescimento:</span>{' '}
                    <strong className="text-[#f0f4f8]">{plant.growthRate}</strong>
                  </div>
                  <div>
                    <span className="text-[#94a3b8]">Faixa de Altura:</span>{' '}
                    <strong className="text-[#f0f4f8]">{plant.heightRangeCm}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#94a3b8]">Exigência de Substrato:</span>{' '}
                    <strong className="text-[#f0f4f8]">{plant.substrateDemand}</strong>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[#cbd5e1]">
                  <strong>Como propagar:</strong> {plant.propagationMethod}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal footer with action */}
        <div className="flex items-center justify-between border-t border-[#1a2c40] bg-[#0c1622] px-6 py-4">
          <div className="text-xs text-[#64748b]">
            Código de catálogo: <code className="text-[#94a3b8]">{species.id}</code>
          </div>

          <button
            type="button"
            onClick={() => onToggleTank(species)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
              isInTank
                ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 hover:bg-[#ef4444]/30'
                : isFish
                ? 'bg-[#00f0ff] text-[#0a1118] font-semibold hover:bg-[#38bdf8]'
                : 'bg-[#22c55e] text-[#0a1118] font-semibold hover:bg-[#4ade80]'
            }`}
          >
            {isInTank ? (
              <>
                <X className="h-4 w-4" />
                <span>Remover do Meu Aquário</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Adicionar ao Meu Aquário</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
