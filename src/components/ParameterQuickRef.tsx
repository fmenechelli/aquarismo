import React from 'react';
import { Droplets, Activity, Thermometer, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function ParameterQuickRef() {
  const parameters = [
    {
      name: 'pH (Potencial Hidrogeniônico)',
      ideal: '6.2 – 7.2 (Geral) / 5.5 – 6.8 (Amazônico)',
      danger: '< 5.0 ou > 8.5 para peixes de água ácida',
      impact: 'Afeta a regulação osmótica e a toxicidade da amônia livre.'
    },
    {
      name: 'Amônia Total (NH3 / NH4+)',
      ideal: '0.00 ppm (Indetectável)',
      danger: '> 0.25 ppm é tóxico e corrosivo para brânquias',
      impact: 'Produto da excreção dos peixes e decomposição orgânica; filtragem biológica deve converter imediatamente.'
    },
    {
      name: 'Nitrito (NO2-)',
      ideal: '0.00 ppm (Indetectável)',
      danger: '> 0.50 ppm impede transporte de oxigênio no sangue',
      impact: 'Segundo estágio do ciclo do nitrogênio, convertido em nitrato por bactérias benéficas Nitrobacter/Nitrospira.'
    },
    {
      name: 'Nitrato (NO3-)',
      ideal: '< 20 ppm (Aquários plantados toleram 10–25 ppm)',
      danger: '> 40 ppm causa estresse crônico e proliferação de algas',
      impact: 'Consumido por plantas vivas e removido através de TPAs (Trocas Parciais de Água regulares).'
    },
    {
      name: 'Temperatura',
      ideal: '24°C – 28°C para maioria das espécies tropicais',
      danger: 'Variações súbitas > 2°C provocam surtos de íctio',
      impact: 'Controla a taxa metabólica basal e a solubilidade do oxigênio dissolvido.'
    },
    {
      name: 'KH (Dureza Carbonatada)',
      ideal: '3 – 6 °dKH para efeito tamponador estável',
      danger: '< 2 °dKH causa risco de quedas bruscas de pH (acid crash)',
      impact: 'Atua como tampão químico contra a acidificação progressiva produzida pela nitrificação biológica.'
    }
  ];

  return (
    <div className="rounded-2xl border border-[#1a2c40] bg-[#121f2d] p-6 shadow-md space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight text-[#f0f4f8] sm:text-2xl">
          Tabela de Referência de Parâmetros Químicos da Água
        </h2>
        <p className="text-xs text-[#94a3b8] sm:text-sm">
          Valores ideais e limiares de segurança para manutenção de aquários de água doce saudáveis.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#1a2c40] text-[#94a3b8]">
              <th className="py-3 px-4 font-semibold">Parâmetro</th>
              <th className="py-3 px-4 font-semibold text-[#22c55e]">Faixa Alvo Ideal</th>
              <th className="py-3 px-4 font-semibold text-red-400">Ponto Crítico</th>
              <th className="py-3 px-4 font-semibold">Significado Biológico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a2c40]/60">
            {parameters.map((param, idx) => (
              <tr key={idx} className="hover:bg-[#0a1118]/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-[#f0f4f8]">
                  {param.name}
                </td>
                <td className="py-3.5 px-4 font-medium text-[#22c55e] tabular-nums">
                  {param.ideal}
                </td>
                <td className="py-3.5 px-4 font-medium text-red-400 tabular-nums">
                  {param.danger}
                </td>
                <td className="py-3.5 px-4 text-[#cbd5e1] leading-relaxed">
                  {param.impact}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
