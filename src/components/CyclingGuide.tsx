import React, { useState } from 'react';
import {
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  CheckSquare,
  Square,
  Sparkles,
  Info
} from 'lucide-react';

interface StageInfo {
  dayRange: string;
  name: string;
  ammoniaLevel: string;
  nitriteLevel: string;
  nitrateLevel: string;
  ammoniaStatus: 'zero' | 'rising' | 'peak' | 'dropping';
  nitriteStatus: 'zero' | 'rising' | 'peak' | 'dropping';
  nitrateStatus: 'zero' | 'rising' | 'high';
  description: string;
  actionItems: string[];
}

const CYCLING_STAGES: StageInfo[] = [
  {
    dayRange: 'Dias 01 a 05',
    name: 'Preparação & Primeira Fonte de Amônia',
    ammoniaLevel: '1.0 – 2.0 ppm',
    nitriteLevel: '0.00 ppm',
    nitrateLevel: '0.00 ppm',
    ammoniaStatus: 'rising',
    nitriteStatus: 'zero',
    nitrateStatus: 'zero',
    description:
      'O aquário está limpo com água tratada. Uma fonte de matéria orgânica (pitada diária de ração ou amoníaco inorgânico) é introduzida para alimentar as primeiras bactérias.',
    actionItems: [
      'Trate toda a água com condicionador desclorificante de alta qualidade.',
      'Deixe o filtro e o termostato ligados 24 horas por dia (temperatura entre 26°C e 28°C estimula proliferação bacteriana).',
      'Adicione dose de acelerador biológico de bactérias nitrificantes conforme instrução do fabricante.',
      'Não adicione nenhum peixe nessa etapa.'
    ]
  },
  {
    dayRange: 'Dias 06 a 14',
    name: 'Pico de Amônia (Multiplicação de Nitrosomonas)',
    ammoniaLevel: '3.0 – 4.0 ppm (PICO)',
    nitriteLevel: '0.25 – 0.50 ppm',
    nitrateLevel: '0.00 ppm',
    ammoniaStatus: 'peak',
    nitriteStatus: 'rising',
    nitrateStatus: 'zero',
    description:
      'A decomposição da matéria orgânica atinge o ápice. A primeira colônia bacteriana (Nitrosomonas) começa a se fixar nas mídias de vidro sinterizado.',
    actionItems: [
      'Monitore a amônia a cada 2 ou 3 dias com teste em gotas.',
      'Caso a amônia ultrapasse 5.0 ppm, faça uma pequena TPA de 20% para não esterilizar as bactérias.',
      'Resista à tentação de limpar o filtro ou trocar a água sem necessidade.',
      'Pequena turvação esbranquiçada na água é um bloom bacteriano normal e desaparecerá espontaneamente.'
    ]
  },
  {
    dayRange: 'Dias 15 a 25',
    name: 'Queda de Amônia & Pico Crítico de Nitrito',
    ammoniaLevel: '0.25 – 0.50 ppm',
    nitriteLevel: '2.0 – 5.0 ppm (PICO)',
    nitrateLevel: '5.0 – 10 ppm',
    ammoniaStatus: 'dropping',
    nitriteStatus: 'peak',
    nitrateStatus: 'rising',
    description:
      'A amônia é convertida rapidamente em nitrito (NO2-). Essa fase costuma ser a mais longa, pois as bactérias Nitrospira/Nitrobacter demoram mais para dobrar sua população.',
    actionItems: [
      'O nitrito elevado é a prova inequívoca de que a primeira etapa do ciclo foi bem-sucedida.',
      'Continue fornecendo pequenas doses de ração a cada 3 dias para manter as Nitrosomonas ativas.',
      'Garanta boa oxigenação superficial com a saída d\'água do filtro, pois o processo nitrificante consome muito oxigênio dissolvido.'
    ]
  },
  {
    dayRange: 'Dias 26 a 35',
    name: 'Conversão em Nitrato & Estabilização',
    ammoniaLevel: '0.00 ppm',
    nitriteLevel: '0.00 – 0.25 ppm',
    nitrateLevel: '20 – 40 ppm',
    ammoniaStatus: 'zero',
    nitriteStatus: 'dropping',
    nitrateStatus: 'high',
    description:
      'A colônia bacteriana agora é capaz de converter a amônia e o nitrito quase que instantaneamente no subproduto final menos tóxico: o nitrato (NO3-).',
    actionItems: [
      'Teste a água diariamente. Quando amônia e nitrito marcarem zero simultaneamente, o ciclo atingiu a maturidade.',
      'Plantas naturais introduzidas agora absorverão avidamente parte do nitrato acumulado.',
      'Realize o Teste de Validação: adicione amônia até ~1.0 ppm e verifique se ela zera completamente em 24 horas.'
    ]
  },
  {
    dayRange: 'Dias 35+',
    name: 'Aquário Maduro & Povoamento Responsável',
    ammoniaLevel: '0.00 ppm',
    nitriteLevel: '0.00 ppm',
    nitrateLevel: '< 15 ppm (Após TPA)',
    ammoniaStatus: 'zero',
    nitriteStatus: 'zero',
    nitrateStatus: 'rising',
    description:
      'O filtro está biologicamente ativo e protegido. A colônia bacteriana agora está pronta para receber a fauna com segurança.',
    actionItems: [
      'Realize uma Troca Parcial de Água (TPA) de 40% para reduzir o nitrato acumulado para menos de 15 ppm.',
      'Insira apenas 2 a 3 espécimes no primeiro lote (nunca popule todo o aquário no mesmo dia).',
      'Aguarde de 7 a 10 dias antes de introduzir novos peixes, permitindo que a biologia expanda na mesma proporção.'
    ]
  }
];

export function CyclingGuide() {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    dechlorinated: true,
    filter24h: true,
    testAmmoniaZero: false,
    testNitriteZero: false,
    nitrateSafe: false,
    tpaDone: false
  });

  const currentStage = CYCLING_STAGES[activeStageIndex];

  const toggleChecklist = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const checklistCount = Object.values(checklist).filter(Boolean).length;
  const isReadyForFish = checklistCount === 6;

  return (
    <div className="space-y-8">
      {/* Header of Section */}
      <div className="rounded-2xl border border-[#1a2c40] bg-[#121f2d] p-6 shadow-md">
        <div className="inline-flex items-center gap-2 rounded-md bg-[#00f0ff]/10 px-2.5 py-1 text-xs font-semibold text-[#00f0ff]">
          <FlaskConical className="h-3.5 w-3.5" />
          <span>Biologia Essencial para Iniciantes</span>
        </div>
        <h2 className="mt-3 text-xl font-bold tracking-tight text-[#f0f4f8] sm:text-2xl">
          Guia Passo a Passo de Ciclagem do Nitrogênio
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-[#94a3b8] sm:text-sm">
          A ciclagem é o período de 30 a 40 dias indispensável para o cultivo de colônias de bactérias nitrificantes benéficas no filtro. Sem ela, a amônia produzida pelos primeiros peixes causa queimaduras químicas nas brânquias e óbito precoce.
        </p>

        {/* Pathway Diagram */}
        <div className="mt-6 rounded-xl border border-[#1a2c40]/80 bg-[#0a1118]/80 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
            A Rota Bioquímica do Ciclo
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-[#1a2c40] bg-[#121f2d] p-3 text-center">
              <span className="text-xs font-semibold text-red-400">1. Matéria Orgânica</span>
              <p className="mt-1 text-[11px] text-[#94a3b8]">Restos de ração e excrementos geram Amônia (NH3)</p>
            </div>
            <div className="rounded-lg border border-[#1a2c40] bg-[#121f2d] p-3 text-center">
              <span className="text-xs font-semibold text-amber-300">2. Nitrosomonas</span>
              <p className="mt-1 text-[11px] text-[#94a3b8]">Bactérias oxidam a Amônia em Nitrito (NO2-)</p>
            </div>
            <div className="rounded-lg border border-[#1a2c40] bg-[#121f2d] p-3 text-center">
              <span className="text-xs font-semibold text-[#38bdf8]">3. Nitrospira</span>
              <p className="mt-1 text-[11px] text-[#94a3b8]">Oxidam o perigoso Nitrito no estável Nitrato (NO3-)</p>
            </div>
            <div className="rounded-lg border border-[#1a2c40] bg-[#121f2d] p-3 text-center">
              <span className="text-xs font-semibold text-[#22c55e]">4. Destino Final</span>
              <p className="mt-1 text-[11px] text-[#94a3b8]">Absorvido por plantas vivas e removido por TPAs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Timeline & Simulator */}
      <div className="rounded-2xl border border-[#1a2c40] bg-[#121f2d] p-6 shadow-md space-y-6">
        <div>
          <h3 className="text-base font-bold text-[#f0f4f8] sm:text-lg">
            Simulador de Evolução da Ciclagem (35 Dias)
          </h3>
          <p className="text-xs text-[#94a3b8]">
            Selecione uma fase da linha do tempo para inspecionar os parâmetros químicos esperados nos testes de água:
          </p>
        </div>

        {/* Phase selector tabs */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {CYCLING_STAGES.map((stage, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveStageIndex(idx)}
              className={`rounded-xl border p-3 text-left transition-all ${
                activeStageIndex === idx
                  ? 'border-[#00f0ff] bg-[#00f0ff]/10 text-[#f0f4f8] shadow-sm'
                  : 'border-[#1a2c40] bg-[#0c1622] text-[#94a3b8] hover:border-[#334e68] hover:text-[#cbd5e1]'
              }`}
            >
              <span className="block text-[10px] font-semibold tracking-wider uppercase text-[#00f0ff]">
                Etapa 0{idx + 1}
              </span>
              <span className="mt-1 block text-xs font-bold leading-tight text-[#f0f4f8]">
                {stage.dayRange}
              </span>
            </button>
          ))}
        </div>

        {/* Stage details inspection card */}
        <div className="rounded-xl border border-[#1a2c40] bg-[#0c1622] p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1a2c40] pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00f0ff]">
                {currentStage.dayRange}
              </span>
              <h4 className="mt-0.5 text-lg font-bold text-[#f0f4f8]">
                {currentStage.name}
              </h4>
            </div>
          </div>

          {/* Test Kit Values readout */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Ammonia */}
            <div className="rounded-xl border border-[#1a2c40] bg-[#0a1118]/90 p-4">
              <span className="text-[11px] font-medium text-[#94a3b8]">Amônia (NH3/NH4+)</span>
              <div className="mt-1 text-lg font-bold tabular-nums text-red-400">
                {currentStage.ammoniaLevel}
              </div>
              <span className="mt-1 block text-[10px] text-[#64748b]">
                {currentStage.ammoniaStatus === 'peak'
                  ? 'Pico máximo tóxico'
                  : currentStage.ammoniaStatus === 'dropping'
                  ? 'Em declínio acelerado'
                  : currentStage.ammoniaStatus === 'zero'
                  ? 'Seguro / Indetectável'
                  : 'Em acumulação'}
              </span>
            </div>

            {/* Nitrite */}
            <div className="rounded-xl border border-[#1a2c40] bg-[#0a1118]/90 p-4">
              <span className="text-[11px] font-medium text-[#94a3b8]">Nitrito (NO2-)</span>
              <div className="mt-1 text-lg font-bold tabular-nums text-amber-300">
                {currentStage.nitriteLevel}
              </div>
              <span className="mt-1 block text-[10px] text-[#64748b]">
                {currentStage.nitriteStatus === 'peak'
                  ? 'Pico crítico de conversão'
                  : currentStage.nitriteStatus === 'dropping'
                  ? 'Despencando para zero'
                  : currentStage.nitriteStatus === 'zero'
                  ? 'Seguro / Indetectável'
                  : 'Início de formação'}
              </span>
            </div>

            {/* Nitrate */}
            <div className="rounded-xl border border-[#1a2c40] bg-[#0a1118]/90 p-4">
              <span className="text-[11px] font-medium text-[#94a3b8]">Nitrato (NO3-)</span>
              <div className="mt-1 text-lg font-bold tabular-nums text-[#22c55e]">
                {currentStage.nitrateLevel}
              </div>
              <span className="mt-1 block text-[10px] text-[#64748b]">
                {currentStage.nitrateStatus === 'high'
                  ? 'Acumulado (exige TPA)'
                  : currentStage.nitrateStatus === 'rising'
                  ? 'Primeiras leituras positivas'
                  : 'Ainda não formado'}
              </span>
            </div>
          </div>

          {/* Description & Action Checklist for current stage */}
          <div className="mt-5 space-y-4">
            <p className="text-xs leading-relaxed text-[#cbd5e1]">
              {currentStage.description}
            </p>

            <div className="rounded-xl border border-[#1a2c40]/80 bg-[#121f2d] p-4">
              <h5 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#00f0ff]">
                <Clock className="h-4 w-4" />
                O que você deve fazer nesta fase
              </h5>
              <ul className="mt-3 space-y-2 text-xs text-[#cbd5e1]">
                {currentStage.actionItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00f0ff]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Beginner Pitfalls (Os 4 Erros Fatais) */}
      <div className="rounded-2xl border border-red-950/40 bg-gradient-to-br from-[#181116] to-[#121f2d] p-6 shadow-md">
        <div className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="h-5 w-5" />
          <h3 className="text-base font-bold text-red-300">
            Os 4 Erros Fatais Mais Comuns de Aquaristas Iniciantes
          </h3>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
          <div className="rounded-xl border border-red-900/30 bg-[#0a1118]/70 p-4">
            <strong className="text-red-300">1. Lavar mídias biológicas em água de torneira</strong>
            <p className="mt-1 text-[#94a3b8] leading-relaxed">
              O cloro da torneira esteriliza instantaneamente todas as bactérias nitrificantes cultivadas por semanas. Mídias só devem ser enxaguadas na própria água retirada do aquário durante uma TPA.
            </p>
          </div>

          <div className="rounded-xl border border-red-900/30 bg-[#0a1118]/70 p-4">
            <strong className="text-red-300">2. Ciclagem com peixes vivos</strong>
            <p className="mt-1 text-[#94a3b8] leading-relaxed">
              Submeter peixes ao pico de amônia e nitrito é cruel e desnecessário. O método <em>fishless</em> com pitadas de ração cria colônias ainda mais robustas sem nenhuma perda animal.
            </p>
          </div>

          <div className="rounded-xl border border-red-900/30 bg-[#0a1118]/70 p-4">
            <strong className="text-red-300">3. Desligar o filtro durante a noite</strong>
            <p className="mt-1 text-[#94a3b8] leading-relaxed">
              Bactérias nitrificantes são estritamente aeróbicas. Se o fluxo d'água cessar por poucas horas, elas morrem por asfixia e a decomposição resultante polui o aquário.
            </p>
          </div>

          <div className="rounded-xl border border-red-900/30 bg-[#0a1118]/70 p-4">
            <strong className="text-red-300">4. Povoar o aquário todo no mesmo dia</strong>
            <p className="mt-1 text-[#94a3b8] leading-relaxed">
              Ao introduzir dezenas de peixes de uma vez só, a carga biológica explode subitamente, sobrecarregando a colônia e gerando um novo e perigoso pico de amônia.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Ready-to-Stock Verification Checklist */}
      <div className="rounded-2xl border border-[#1a2c40] bg-[#121f2d] p-6 shadow-md space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-[#f0f4f8] sm:text-lg">
              Checklist de Segurança Antes da Compra dos Peixes
            </h3>
            <p className="text-xs text-[#94a3b8]">
              Marque os itens conforme confirmar em seus testes laboratoriais caseiros:
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                isReadyForFish
                  ? 'border border-[#22c55e]/40 bg-[#22c55e]/15 text-[#22c55e]'
                  : 'border border-[#1a2c40] bg-[#0c1622] text-[#94a3b8]'
              }`}
            >
              {checklistCount}/6 Verificações concluídas
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs">
          {[
            {
              id: 'dechlorinated',
              label: 'Água inicial desclorificada com condicionador e sem metais pesados'
            },
            {
              id: 'filter24h',
              label: 'Filtro e termostato operando ininterruptamente há mais de 30 dias'
            },
            {
              id: 'testAmmoniaZero',
              label: 'Teste de Amônia Total marcando rigorosamente 0.00 ppm'
            },
            {
              id: 'testNitriteZero',
              label: 'Teste de Nitrito (NO2-) marcando rigorosamente 0.00 ppm'
            },
            {
              id: 'nitrateSafe',
              label: 'Presença confirmada de Nitrato (NO3-), atestando ciclo biológico ativo'
            },
            {
              id: 'tpaDone',
              label: 'TPA preparatória de 30% a 40% executada para baixar o nitrato residual'
            }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleChecklist(item.id)}
              className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                checklist[item.id]
                  ? 'border-[#22c55e]/40 bg-[#22c55e]/10 text-[#f0f4f8]'
                  : 'border-[#1a2c40] bg-[#0c1622] text-[#94a3b8] hover:border-[#334e68]'
              }`}
            >
              {checklist[item.id] ? (
                <CheckSquare className="h-4 w-4 shrink-0 text-[#22c55e]" />
              ) : (
                <Square className="h-4 w-4 shrink-0 text-[#64748b]" />
              )}
              <span className={checklist[item.id] ? 'font-medium' : ''}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {isReadyForFish ? (
          <div className="flex items-center gap-3 rounded-xl border border-[#22c55e]/40 bg-[#22c55e]/15 p-4 text-xs font-semibold text-[#22c55e]">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>
              Parabéns! O seu ecossistema aquático está maduro e seguro para receber o primeiro lote de peixes ou invertebrados!
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-[#1a2c40] bg-[#0c1622] p-4 text-xs text-[#94a3b8]">
            <Info className="h-4 w-4 shrink-0 text-[#38bdf8]" />
            <span>
              Conclua todas as verificações acima antes de adquirir as espécies para garantir a integridade biológica do aquário.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
