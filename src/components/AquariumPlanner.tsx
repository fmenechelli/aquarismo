import React, { useMemo, useState } from 'react';
import { TankItem, Species, FishSpecies } from '../types/aquarium';
import { Droplets, Thermometer, ShieldAlert, CheckCircle2, AlertTriangle, Trash2, Plus, Minus, Info, Sparkles, Layers } from 'lucide-react';

interface AquariumPlannerProps {
  items: TankItem[];
  onUpdateQuantity: (speciesId: string, delta: number) => void;
  onRemoveItem: (speciesId: string) => void;
  onClearTank: () => void;
  onLoadPreset: (speciesIds: string[]) => void;
  onOpenDetails: (species: Species) => void;
}

export function AquariumPlanner({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearTank,
  onLoadPreset,
  onOpenDetails
}: AquariumPlannerProps) {
  const [tankLiters, setTankLiters] = useState<number>(100);

  // Calculate combined compatibility parameters
  const compatibility = useMemo(() => {
    if (items.length === 0) {
      return {
        hasItems: false,
        phConflict: false,
        tempConflict: false,
        phOverlap: { min: 6.0, max: 7.2 },
        tempOverlap: { min: 24, max: 28 },
        bioloadPercent: 0,
        volumeAlerts: [] as string[],
        schoolAlerts: [] as string[],
        behaviorAlerts: [] as string[],
        status: 'empty' as 'empty' | 'perfect' | 'warning' | 'danger'
      };
    }

    let overallMinPh = Math.max(...items.map((i) => i.species.minPh));
    let overallMaxPh = Math.min(...items.map((i) => i.species.maxPh));
    const phConflict = overallMinPh > overallMaxPh;

    let overallMinTemp = Math.max(...items.map((i) => i.species.minTemp));
    let overallMaxTemp = Math.min(...items.map((i) => i.species.maxTemp));
    const tempConflict = overallMinTemp > overallMaxTemp;

    // Bioload calculation: 1 cm of adult fish per liter (classic guideline)
    let totalFishCentimeters = 0;
    const volumeAlerts: string[] = [];
    const schoolAlerts: string[] = [];
    const behaviorAlerts: string[] = [];

    const fishItems = items.filter((i) => i.species.type === 'fish');

    fishItems.forEach((i) => {
      const fish = i.species as FishSpecies;
      totalFishCentimeters += fish.maxSizeCm * i.quantity;

      if (fish.minTankLiters > tankLiters) {
        volumeAlerts.push(
          `${fish.commonName} requer um aquário de no mínimo ${fish.minTankLiters}L (aquário atual: ${tankLiters}L).`
        );
      }

      if (fish.idealSchoolSize && i.quantity < fish.idealSchoolSize) {
        schoolAlerts.push(
          `${fish.commonName} é espécie de cardume. Recomenda-se manter pelo menos ${fish.idealSchoolSize} espécimes (atual: ${i.quantity}).`
        );
      }

      if (fish.id === 'betta-splendens' && i.quantity > 1) {
        behaviorAlerts.push(
          'Atenção crítica: Mais de um Betta macho no mesmo aquário causará disputas fatais.'
        );
      }
    });

    const bioloadPercent = Math.min(200, Math.round((totalFishCentimeters / tankLiters) * 100));

    let status: 'perfect' | 'warning' | 'danger' = 'perfect';
    if (phConflict || tempConflict || bioloadPercent > 130) {
      status = 'danger';
    } else if (volumeAlerts.length > 0 || schoolAlerts.length > 0 || bioloadPercent > 90) {
      status = 'warning';
    }

    return {
      hasItems: true,
      phConflict,
      tempConflict,
      phOverlap: { min: overallMinPh, max: overallMaxPh },
      tempOverlap: { min: overallMinTemp, max: overallMaxTemp },
      bioloadPercent,
      volumeAlerts,
      schoolAlerts,
      behaviorAlerts,
      status
    };
  }, [items, tankLiters]);

  const presets = [
    { label: 'Nano Plantado (35L)', liters: 35, ids: ['tetra-cardinal', 'anubias-nana', 'musgo-java', 'otocinclus'] },
    { label: 'Biótopo Rio Negro (200L)', liters: 200, ids: ['acara-disco', 'tetra-cardinal', 'rodostomo', 'echinodorus-bleheri'] },
    { label: 'Comunitário Geral (120L)', liters: 120, ids: ['corydoras-bronze', 'rasbora-arlequim', 'microsorum-pteropus', 'vallisneria-spiralis'] }
  ];

  return (
    <div className="space-y-8">
      {/* Title & Tank Capacity Configuration */}
      <div className="rounded-2xl border border-[#1a2c40] bg-[#121f2d] p-6 shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#f0f4f8] sm:text-2xl">
              Planejador de Aquário & Compatibilidade Biológica
            </h2>
            <p className="mt-1 text-xs text-[#94a3b8] sm:text-sm">
              Simule a fauna e flora do seu aquário para verificar sobreposição físico-química de pH, temperatura e lotação.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearTank}
                className="flex items-center gap-1.5 rounded-lg border border-[#1a2c40] bg-[#0c1622] px-3 py-1.5 text-xs font-medium text-[#94a3b8] hover:border-red-900/60 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Limpar Aquário</span>
              </button>
            )}
          </div>
        </div>

        {/* Tank Volume Selector */}
        <div className="mt-6 border-t border-[#1a2c40]/80 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label htmlFor="volume-range" className="text-sm font-medium text-[#f0f4f8]">
              Volume Bruto do Aquário:{' '}
              <span className="font-bold text-[#00f0ff] tabular-nums">{tankLiters} Litros</span>
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {[30, 60, 100, 200, 350].map((vol) => (
                <button
                  key={vol}
                  type="button"
                  onClick={() => setTankLiters(vol)}
                  className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                    tankLiters === vol
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50'
                      : 'bg-[#0a1118] text-[#94a3b8] border border-[#1a2c40] hover:text-[#f0f4f8]'
                  }`}
                >
                  {vol}L
                </button>
              ))}
            </div>
          </div>

          <input
            id="volume-range"
            type="range"
            min="15"
            max="600"
            step="5"
            value={tankLiters}
            onChange={(e) => setTankLiters(Number(e.target.value))}
            className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#0a1118] accent-[#00f0ff]"
          />
        </div>
      </div>

      {/* Preset fast selector if empty */}
      {items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#1a2c40] bg-[#0c1622]/50 p-8 text-center">
          <Layers className="mx-auto h-8 w-8 text-[#64748b]" />
          <h3 className="mt-3 text-base font-semibold text-[#f0f4f8]">
            Seu aquário virtual está vazio no momento
          </h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-[#94a3b8]">
            Adicione peixes ou plantas do catálogo principal clicando em <strong>"+ Planejar"</strong>, ou carregue uma combinação predefinida para testar o simulador:
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setTankLiters(preset.liters);
                  onLoadPreset(preset.ids);
                }}
                className="flex items-center gap-2 rounded-xl border border-[#1a2c40] bg-[#121f2d] px-4 py-2.5 text-xs font-medium text-[#cbd5e1] shadow-sm transition-colors hover:border-[#00f0ff]/50 hover:text-[#f0f4f8]"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#00f0ff]" />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* When items exist, show Analysis + Selected Items grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Diagnostic panel (1 column) */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-[#1a2c40] bg-[#121f2d] p-5 shadow-sm">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-[#94a3b8]">
                Diagnóstico de Compatibilidade
              </h3>

              {/* Status Header Badge */}
              <div
                className={`mt-3 flex items-center gap-2 rounded-xl p-3 text-xs font-medium ${
                  compatibility.status === 'perfect'
                    ? 'border border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]'
                    : compatibility.status === 'warning'
                    ? 'border border-amber-500/30 bg-amber-500/10 text-amber-300'
                    : 'border border-red-500/30 bg-red-500/10 text-red-300'
                }`}
              >
                {compatibility.status === 'perfect' ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Excelente harmonia biológica e de parâmetros!</span>
                  </>
                ) : compatibility.status === 'warning' ? (
                  <>
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>Atenção aos pontos de manejo abaixo.</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span>Incompatibilidade detectada entre espécies.</span>
                  </>
                )}
              </div>

              {/* Metrics strip */}
              <div className="mt-4 space-y-3 text-xs">
                {/* pH Window */}
                <div className="rounded-xl border border-[#1a2c40]/80 bg-[#0a1118]/80 p-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[#94a3b8]">
                      <Droplets className="h-3.5 w-3.5 text-[#38bdf8]" />
                      Janela Comum de pH
                    </span>
                    {!compatibility.phConflict ? (
                      <span className="font-semibold text-[#38bdf8] tabular-nums">
                        {compatibility.phOverlap.min.toFixed(1)} – {compatibility.phOverlap.max.toFixed(1)}
                      </span>
                    ) : (
                      <span className="font-semibold text-red-400">Conflito de pH</span>
                    )}
                  </div>
                  {compatibility.phConflict && (
                    <p className="mt-1 text-[11px] text-red-300">
                      As espécies selecionadas não compartilham faixa de acidez/alcalinidade segura comum.
                    </p>
                  )}
                </div>

                {/* Temperature Window */}
                <div className="rounded-xl border border-[#1a2c40]/80 bg-[#0a1118]/80 p-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[#94a3b8]">
                      <Thermometer className="h-3.5 w-3.5 text-[#f87171]" />
                      Janela de Temperatura
                    </span>
                    {!compatibility.tempConflict ? (
                      <span className="font-semibold text-[#f87171] tabular-nums">
                        {compatibility.tempOverlap.min}°C – {compatibility.tempOverlap.max}°C
                      </span>
                    ) : (
                      <span className="font-semibold text-red-400">Conflito Térmico</span>
                    )}
                  </div>
                  {compatibility.tempConflict && (
                    <p className="mt-1 text-[11px] text-red-300">
                      Algumas espécies exigem água fria enquanto outras exigem temperaturas elevadas.
                    </p>
                  )}
                </div>

                {/* Bioload Bar */}
                <div className="rounded-xl border border-[#1a2c40]/80 bg-[#0a1118]/80 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#94a3b8]">Carga Biológica Estimada</span>
                    <span
                      className={`font-semibold tabular-nums ${
                        compatibility.bioloadPercent > 100
                          ? 'text-red-400'
                          : compatibility.bioloadPercent > 80
                          ? 'text-amber-300'
                          : 'text-[#22c55e]'
                      }`}
                    >
                      {compatibility.bioloadPercent}%
                    </span>
                  </div>
                  <div className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-[#1a2c40]">
                    <div
                      className={`absolute top-0 bottom-0 rounded-full transition-all duration-300 ${
                        compatibility.bioloadPercent > 100
                          ? 'bg-red-500'
                          : compatibility.bioloadPercent > 80
                          ? 'bg-amber-400'
                          : 'bg-[#22c55e]'
                      }`}
                      style={{ width: `${Math.min(100, compatibility.bioloadPercent)}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[10px] text-[#64748b]">
                    Baseado no porte adulto dos peixes versus capacidade volumétrica do filtro.
                  </p>
                </div>
              </div>

              {/* Detailed Alerts List */}
              {(compatibility.volumeAlerts.length > 0 ||
                compatibility.schoolAlerts.length > 0 ||
                compatibility.behaviorAlerts.length > 0) && (
                <div className="mt-4 space-y-2 border-t border-[#1a2c40]/80 pt-4 text-xs">
                  {compatibility.volumeAlerts.map((txt, idx) => (
                    <div key={`vol-${idx}`} className="flex items-start gap-2 text-amber-300">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{txt}</span>
                    </div>
                  ))}
                  {compatibility.schoolAlerts.map((txt, idx) => (
                    <div key={`sch-${idx}`} className="flex items-start gap-2 text-[#38bdf8]">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{txt}</span>
                    </div>
                  ))}
                  {compatibility.behaviorAlerts.map((txt, idx) => (
                    <div key={`beh-${idx}`} className="flex items-start gap-2 text-red-300">
                      <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{txt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Species in Tank List (2 columns) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-[#94a3b8]">
                Habitantes Configurados ({items.reduce((acc, i) => acc + i.quantity, 0)} espécimes)
              </h3>
            </div>

            <div className="space-y-2.5">
              {items.map((item) => {
                const isFish = item.species.type === 'fish';
                return (
                  <div
                    key={item.species.id}
                    className="flex flex-col gap-3 rounded-xl border border-[#1a2c40] bg-[#121f2d] p-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between hover:border-[#334e68]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#0a1118]">
                        <img
                          src={item.species.imageUrl}
                          alt={item.species.commonName}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenDetails(item.species)}
                            className="text-sm font-semibold text-[#f0f4f8] hover:text-[#00f0ff] hover:underline"
                          >
                            {item.species.commonName}
                          </button>
                          <span
                            className={`rounded px-1.5 py-0.2 text-[10px] font-medium uppercase ${
                              isFish
                                ? 'bg-[#00f0ff]/10 text-[#00f0ff]'
                                : 'bg-[#22c55e]/10 text-[#22c55e]'
                            }`}
                          >
                            {isFish ? 'Peixe' : 'Planta'}
                          </span>
                        </div>
                        <p className="text-xs italic text-[#94a3b8]">
                          {item.species.scientificName} · pH {item.species.minPh}–{item.species.maxPh} · {item.species.minTemp}–{item.species.maxTemp}°C
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 shrink-0">
                      <div className="flex items-center rounded-lg border border-[#1a2c40] bg-[#0c1622] p-1">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.species.id, -1)}
                          className="flex h-6 w-6 items-center justify-center rounded text-[#94a3b8] hover:bg-[#1a2c40] hover:text-[#f0f4f8]"
                          title="Diminuir quantidade"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-[#f0f4f8] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.species.id, 1)}
                          className="flex h-6 w-6 items-center justify-center rounded text-[#94a3b8] hover:bg-[#1a2c40] hover:text-[#f0f4f8]"
                          title="Aumentar quantidade"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.species.id)}
                        className="rounded-lg p-1.5 text-[#64748b] transition-colors hover:bg-red-500/10 hover:text-red-400"
                        title="Remover do aquário"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
