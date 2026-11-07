export type SpeciesType = 'fish' | 'plant';

export type CareLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

export type Temperament = 'Pacífico' | 'Cardume' | 'Territorial' | 'Tímido' | 'Semi-agressivo';

export type SwimmingLevel = 'Superfície' | 'Meio' | 'Fundo' | 'Todos os níveis';

export type DietType = 'Onívoro' | 'Herbívoro' | 'Carnívoro' | 'Detritívoro / Algívoro';

export type PlantPosition = 'Carpete (Frente)' | 'Plano Médio' | 'Fundo' | 'Epífita (Fixação)' | 'Flutuante';

export type LightDemand = 'Baixa' | 'Média' | 'Alta';

export type GrowthRate = 'Lento' | 'Moderado' | 'Rápido';

export type Co2Demand = 'Não necessário' | 'Recomendado' | 'Indispensável';

export interface BaseSpecies {
  id: string;
  type: SpeciesType;
  commonName: string;
  scientificName: string;
  family: string;
  origin: string;
  description: string;
  imageUrl: string;
  careLevel: CareLevel;
  minPh: number;
  maxPh: number;
  minTemp: number; // °C
  maxTemp: number; // °C
  tags: string[];
}

export interface FishSpecies extends BaseSpecies {
  type: 'fish';
  maxSizeCm: number;
  minTankLiters: number;
  temperament: Temperament;
  swimmingLevel: SwimmingLevel;
  diet: DietType;
  idealSchoolSize?: number;
  compatibilityNotes: string;
  reproductionNotes: string;
}

export interface PlantSpecies extends BaseSpecies {
  type: 'plant';
  position: PlantPosition;
  lightDemand: LightDemand;
  growthRate: GrowthRate;
  co2Demand: Co2Demand;
  substrateDemand: 'Inerte aceitável' | 'Substrato fértil recomendado' | 'Não plantar em substrato';
  propagationMethod: string;
  heightRangeCm: string;
}

export type Species = FishSpecies | PlantSpecies;

export interface Biotope {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  typicalPh: string;
  typicalTemp: string;
  typicalHardness: string;
  substrate: string;
  recommendedSpeciesIds: string[];
}

export interface TankItem {
  species: Species;
  quantity: number;
}
