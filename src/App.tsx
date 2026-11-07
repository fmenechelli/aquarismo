import React, { useState, useMemo } from 'react';
import { FISH_DATABASE, PLANT_DATABASE } from './data/speciesData';
import { Species, TankItem, CareLevel, SpeciesType } from './types/aquarium';
import { SpeciesCard } from './components/SpeciesCard';
import { SpeciesModal } from './components/SpeciesModal';
import { AquariumPlanner } from './components/AquariumPlanner';
import { BiotopeGuide } from './components/BiotopeGuide';
import { ParameterQuickRef } from './components/ParameterQuickRef';
import { CyclingGuide } from './components/CyclingGuide';
import {
  Search,
  Filter,
  Layers,
  Sparkles,
  BookOpen,
  Droplets,
  SlidersHorizontal,
  X,
  Plus
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'planner' | 'biotopes' | 'parameters'>('catalog');
  const [parameterSubTab, setParameterSubTab] = useState<'cycling' | 'chemistry' | 'both'>('cycling');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'fish' | 'plant'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCareLevel, setSelectedCareLevel] = useState<string>('all');
  const [selectedPhRange, setSelectedPhRange] = useState<string>('all');
  const [selectedPositionOrLevel, setSelectedPositionOrLevel] = useState<string>('all');

  const [selectedSpeciesForModal, setSelectedSpeciesForModal] = useState<Species | null>(null);

  // Virtual tank items state
  const [tankItems, setTankItems] = useState<TankItem[]>([
    { species: FISH_DATABASE[0], quantity: 10 },
    { species: PLANT_DATABASE[0], quantity: 2 },
    { species: FISH_DATABASE[5], quantity: 4 }
  ]);

  // Combined full catalog
  const allSpecies: Species[] = useMemo(() => {
    return [...FISH_DATABASE, ...PLANT_DATABASE];
  }, []);

  // Filtered catalog
  const filteredSpecies = useMemo(() => {
    return allSpecies.filter((item) => {
      // Category filter
      if (categoryFilter === 'fish' && item.type !== 'fish') return false;
      if (categoryFilter === 'plant' && item.type !== 'plant') return false;

      // Care level filter
      if (selectedCareLevel !== 'all' && item.careLevel !== selectedCareLevel) return false;

      // pH Range filter
      if (selectedPhRange === 'acid' && item.maxPh > 6.8) return false;
      if (selectedPhRange === 'neutral' && (item.minPh > 7.2 || item.maxPh < 6.8)) return false;
      if (selectedPhRange === 'alkaline' && item.minPh < 7.0) return false;

      // Position / swimming level filter
      if (selectedPositionOrLevel !== 'all') {
        if (item.type === 'fish' && item.swimmingLevel !== selectedPositionOrLevel) return false;
        if (item.type === 'plant' && item.position !== selectedPositionOrLevel) return false;
      }

      // Search query (common name, scientific, family, origin, tags)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.commonName.toLowerCase().includes(q);
        const matchesSci = item.scientificName.toLowerCase().includes(q);
        const matchesFamily = item.family.toLowerCase().includes(q);
        const matchesOrigin = item.origin.toLowerCase().includes(q);
        const matchesTag = item.tags.some((t) => t.toLowerCase().includes(q));

        if (!matchesName && !matchesSci && !matchesFamily && !matchesOrigin && !matchesTag) {
          return false;
        }
      }

      return true;
    });
  }, [allSpecies, categoryFilter, selectedCareLevel, selectedPhRange, selectedPositionOrLevel, searchQuery]);

  const toggleTankItem = (species: Species) => {
    setTankItems((prev) => {
      const exists = prev.find((i) => i.species.id === species.id);
      if (exists) {
        return prev.filter((i) => i.species.id !== species.id);
      } else {
        const initialQty = species.type === 'fish' && (species as any).idealSchoolSize ? (species as any).idealSchoolSize : 1;
        return [...prev, { species, quantity: initialQty }];
      }
    });
  };

  const updateTankQuantity = (speciesId: string, delta: number) => {
    setTankItems((prev) => {
      return prev
        .map((i) => {
          if (i.species.id === speciesId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as TankItem[];
    });
  };

  const removeTankItem = (speciesId: string) => {
    setTankItems((prev) => prev.filter((i) => i.species.id !== speciesId));
  };

  const loadPresetIntoTank = (speciesIds: string[]) => {
    const selected = allSpecies.filter((s) => speciesIds.includes(s.id));
    const newItems: TankItem[] = selected.map((s) => ({
      species: s,
      quantity: s.type === 'fish' && (s as any).idealSchoolSize ? (s as any).idealSchoolSize : 2
    }));
    setTankItems(newItems);
    setActiveTab('planner');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCareLevel !== 'all' ||
    selectedPhRange !== 'all' ||
    selectedPositionOrLevel !== 'all' ||
    categoryFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setSelectedCareLevel('all');
    setSelectedPhRange('all');
    setSelectedPositionOrLevel('all');
  };

  const isSpeciesInTank = (id: string) => tankItems.some((i) => i.species.id === id);

  return (
    <div className="min-h-screen bg-[#0a1118] text-[#f0f4f8] selection:bg-[#00f0ff]/20 selection:text-[#00f0ff]">
      {/* Top Bar following Top Bar Contract: Brand, Nav links, 1 primary action */}
      <header className="sticky top-0 z-40 border-b border-[#1a2c40]/80 bg-[#0a1118]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Brand wordmark */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('catalog');
              setCategoryFilter('all');
            }}
            className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-[#f0f4f8] whitespace-nowrap shrink-0 hover:opacity-90"
          >
            <span>Aquafilia</span>
            <span className="text-[#00f0ff]">.</span>
          </button>

          {/* Zone 2: Single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#94a3b8]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('catalog');
                setCategoryFilter('all');
              }}
              className={`hover:text-[#f0f4f8] transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'catalog' && categoryFilter === 'all' ? 'text-[#00f0ff] font-semibold' : ''
              }`}
            >
              Catálogo Geral
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('catalog');
                setCategoryFilter('fish');
              }}
              className={`hover:text-[#f0f4f8] transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'catalog' && categoryFilter === 'fish' ? 'text-[#00f0ff] font-semibold' : ''
              }`}
            >
              Peixes ({FISH_DATABASE.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('catalog');
                setCategoryFilter('plant');
              }}
              className={`hover:text-[#f0f4f8] transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'catalog' && categoryFilter === 'plant' ? 'text-[#22c55e] font-semibold' : ''
              }`}
            >
              Plantas ({PLANT_DATABASE.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('biotopes')}
              className={`hover:text-[#f0f4f8] transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'biotopes' ? 'text-[#00f0ff] font-semibold' : ''
              }`}
            >
              Biótopos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('parameters')}
              className={`hover:text-[#f0f4f8] transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'parameters' ? 'text-[#00f0ff] font-semibold' : ''
              }`}
            >
              Parâmetros & Ciclagem
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('planner')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'planner'
                  ? 'bg-[#00f0ff] text-[#0a1118]'
                  : 'border border-[#00f0ff]/40 bg-[#00f0ff]/10 text-[#00f0ff] hover:bg-[#00f0ff]/20'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Simulador ({tankItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        {/* Navigation tabs for mobile view */}
        <div className="mb-6 flex overflow-x-auto pb-2 md:hidden">
          <div className="flex items-center gap-1 rounded-xl bg-[#121f2d] p-1 border border-[#1a2c40]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('catalog');
                setCategoryFilter('all');
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
                activeTab === 'catalog' && categoryFilter === 'all'
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff]'
                  : 'text-[#94a3b8]'
              }`}
            >
              Catálogo
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('catalog');
                setCategoryFilter('fish');
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
                activeTab === 'catalog' && categoryFilter === 'fish'
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff]'
                  : 'text-[#94a3b8]'
              }`}
            >
              Peixes
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('catalog');
                setCategoryFilter('plant');
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
                activeTab === 'catalog' && categoryFilter === 'plant'
                  ? 'bg-[#22c55e]/20 text-[#22c55e]'
                  : 'text-[#94a3b8]'
              }`}
            >
              Plantas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('biotopes')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
                activeTab === 'biotopes'
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff]'
                  : 'text-[#94a3b8]'
              }`}
            >
              Biótopos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('parameters')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
                activeTab === 'parameters'
                  ? 'bg-[#00f0ff]/20 text-[#00f0ff]'
                  : 'text-[#94a3b8]'
              }`}
            >
              Ciclagem & Água
            </button>
          </div>
        </div>

        {/* Tab 1: Catalog with search and filters */}
        {activeTab === 'catalog' && (
          <div className="space-y-8">
            {/* Hero / intro banner */}
            <div className="rounded-2xl border border-[#1a2c40] bg-gradient-to-r from-[#121f2d] via-[#0e1b29] to-[#0a1118] p-6 sm:p-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-md bg-[#00f0ff]/10 px-2.5 py-1 text-xs font-semibold text-[#00f0ff]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Base de Dados & Enciclopédia Prática</span>
                </div>
                <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#f0f4f8] sm:text-4xl">
                  Pesquisa e Referência para Aquarismo de Água Doce
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-[#94a3b8] sm:text-base">
                  Consulte parâmetros físico-químicos (pH, temperatura, tamanho mínimo), comportamento gregário, iluminação botânica e compatibilidade entre peixes e plantas tropicais.
                </p>
              </div>

              {/* Search input with live filter */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquise por nome popular, nome científico, família (ex: Characidae, Cichlidae), origem ou característica..."
                    className="w-full rounded-xl border border-[#1a2c40] bg-[#0c1622] py-3 pl-10 pr-4 text-xs sm:text-sm text-[#f0f4f8] placeholder-[#64748b] transition-colors focus:border-[#00f0ff] focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#f0f4f8]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#1a2c40] bg-[#0c1622] px-4 py-3 text-xs font-medium text-[#94a3b8] hover:text-[#f0f4f8]"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Limpar Filtros</span>
                  </button>
                )}
              </div>

              {/* Quick filter pills */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                {/* Category toggles */}
                <div className="flex items-center rounded-lg border border-[#1a2c40] bg-[#0a1118] p-1">
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('all')}
                    className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                      categoryFilter === 'all'
                        ? 'bg-[#1a2c40] text-[#f0f4f8]'
                        : 'text-[#94a3b8] hover:text-[#f0f4f8]'
                    }`}
                  >
                    Todos ({allSpecies.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('fish')}
                    className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                      categoryFilter === 'fish'
                        ? 'bg-[#00f0ff]/20 text-[#00f0ff]'
                        : 'text-[#94a3b8] hover:text-[#f0f4f8]'
                    }`}
                  >
                    Peixes ({FISH_DATABASE.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('plant')}
                    className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                      categoryFilter === 'plant'
                        ? 'bg-[#22c55e]/20 text-[#22c55e]'
                        : 'text-[#94a3b8] hover:text-[#f0f4f8]'
                    }`}
                  >
                    Plantas ({PLANT_DATABASE.length})
                  </button>
                </div>

                {/* Care level filter */}
                <select
                  value={selectedCareLevel}
                  onChange={(e) => setSelectedCareLevel(e.target.value)}
                  className="rounded-lg border border-[#1a2c40] bg-[#0a1118] px-3 py-1.5 text-xs text-[#cbd5e1] focus:border-[#00f0ff] focus:outline-none"
                >
                  <option value="all">Nível de Cuidado (Todos)</option>
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>

                {/* pH Range filter */}
                <select
                  value={selectedPhRange}
                  onChange={(e) => setSelectedPhRange(e.target.value)}
                  className="rounded-lg border border-[#1a2c40] bg-[#0a1118] px-3 py-1.5 text-xs text-[#cbd5e1] focus:border-[#00f0ff] focus:outline-none"
                >
                  <option value="all">Faixa de pH (Todas)</option>
                  <option value="acid">Ácido (&lt; 6.8)</option>
                  <option value="neutral">Neutro (6.8 – 7.2)</option>
                  <option value="alkaline">Alcalino (&gt; 7.0)</option>
                </select>
              </div>
            </div>

            {/* Results count & status */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#94a3b8]">
                Exibindo <strong className="text-[#f0f4f8] tabular-nums">{filteredSpecies.length}</strong> de {allSpecies.length} espécies cadastradas
              </span>

              {hasActiveFilters && (
                <span className="text-xs text-[#00f0ff]">Filtros ativos</span>
              )}
            </div>

            {/* Species Grid */}
            {filteredSpecies.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSpecies.map((species) => (
                  <SpeciesCard
                    key={species.id}
                    species={species}
                    onOpenDetails={(s) => setSelectedSpeciesForModal(s)}
                    onToggleTank={(s) => toggleTankItem(s)}
                    isInTank={isSpeciesInTank(species.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#1a2c40] bg-[#121f2d]/50 p-12 text-center">
                <Search className="mx-auto h-8 w-8 text-[#64748b]" />
                <h3 className="mt-3 text-base font-semibold text-[#f0f4f8]">
                  Nenhuma espécie encontrada com esses critérios
                </h3>
                <p className="mt-1 text-xs text-[#94a3b8]">
                  Experimente buscar por outros termos como "Tetra", "Amazônia", "Low-Tech" ou limpe os filtros aplicados.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-lg border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-4 py-2 text-xs font-semibold text-[#00f0ff] hover:bg-[#00f0ff]/20"
                >
                  Restaurar Todos os Resultados
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Aquarium Planner & Compatibility Simulator */}
        {activeTab === 'planner' && (
          <AquariumPlanner
            items={tankItems}
            onUpdateQuantity={updateTankQuantity}
            onRemoveItem={removeTankItem}
            onClearTank={() => setTankItems([])}
            onLoadPreset={loadPresetIntoTank}
            onOpenDetails={(s) => setSelectedSpeciesForModal(s)}
          />
        )}

        {/* Tab 3: Biotope Natural Guides */}
        {activeTab === 'biotopes' && (
          <BiotopeGuide onLoadBiotope={loadPresetIntoTank} />
        )}

        {/* Tab 4: Parameters & Nitrogen Cycling Guide */}
        {activeTab === 'parameters' && (
          <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#1a2c40]/80 pb-5">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#f0f4f8]">
                  Condicionamento, Ciclagem e Química da Água
                </h1>
                <p className="mt-1 text-xs text-[#94a3b8] sm:text-sm">
                  Orientações fundamentais para maturação biológica e equilíbrio do aquário.
                </p>
              </div>

              <div className="flex items-center gap-1 rounded-xl border border-[#1a2c40] bg-[#121f2d] p-1 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setParameterSubTab('cycling')}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    parameterSubTab === 'cycling'
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff]'
                      : 'text-[#94a3b8] hover:text-[#f0f4f8]'
                  }`}
                >
                  Guia de Ciclagem
                </button>
                <button
                  type="button"
                  onClick={() => setParameterSubTab('chemistry')}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    parameterSubTab === 'chemistry'
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff]'
                      : 'text-[#94a3b8] hover:text-[#f0f4f8]'
                  }`}
                >
                  Tabela de Parâmetros
                </button>
                <button
                  type="button"
                  onClick={() => setParameterSubTab('both')}
                  className={`hidden sm:inline-block rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    parameterSubTab === 'both'
                      ? 'bg-[#00f0ff]/20 text-[#00f0ff]'
                      : 'text-[#94a3b8] hover:text-[#f0f4f8]'
                  }`}
                >
                  Ver Ambos
                </button>
              </div>
            </div>

            {(parameterSubTab === 'cycling' || parameterSubTab === 'both') && (
              <CyclingGuide />
            )}

            {(parameterSubTab === 'chemistry' || parameterSubTab === 'both') && (
              <ParameterQuickRef />
            )}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <SpeciesModal
        species={selectedSpeciesForModal}
        onClose={() => setSelectedSpeciesForModal(null)}
        onToggleTank={(s) => toggleTankItem(s)}
        isInTank={selectedSpeciesForModal ? isSpeciesInTank(selectedSpeciesForModal.id) : false}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-[#1a2c40]/80 bg-[#0a1118] px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <div className="flex items-center gap-1.5 text-base font-bold text-[#f0f4f8]">
              <span>Aquafilia</span>
              <span className="text-[#00f0ff]">.</span>
            </div>
            <p className="mt-1 text-xs text-[#64748b]">
              Guia científico e de referência técnica para aquaristas de água doce.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#94a3b8]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('catalog');
                setCategoryFilter('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#f0f4f8]"
            >
              Catálogo de Espécies
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('planner');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#f0f4f8]"
            >
              Simulador de Compatibilidade
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('biotopes');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#f0f4f8]"
            >
              Biótopos
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('parameters');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#f0f4f8]"
            >
              Parâmetros da Água
            </button>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-[#1a2c40]/60 pt-6 text-center text-[11px] text-[#475569]">
          © {new Date().getFullYear()} Aquafilia. Dados biológicos compilados para fins educacionais e preservação do bem-estar animal.
        </div>
      </footer>
    </div>
  );
}
