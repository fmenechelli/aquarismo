import React, { useState } from 'react';
import {
  Utensils,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
  Heart,
  Droplets,
  CheckCircle2,
  BookmarkCheck,
  Flame,
  Info
} from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  targetSpecies: string;
  prepTime: string;
  difficulty: 'Fácil' | 'Médio';
  yields: string;
  shelfLife: string;
  description: string;
  badgeColor: string;
  ingredients: { item: string; amount: string; purpose: string }[];
  steps: string[];
  feedingTip: string;
}

const RECIPES: Recipe[] = [
  {
    id: 'pate-tropical',
    title: 'Patê Gelificado Tropical Polivalente',
    targetSpecies: 'Tetras, Acarás-Disco, Acarás-Bandeira, Ramirezi e Peixes de Meio',
    prepTime: '25 minutos',
    difficulty: 'Fácil',
    yields: '~30 a 40 cubos médios',
    shelfLife: 'Até 90 dias no freezer (-18°C)',
    description:
      'Uma emulsão rica em proteínas animais nobres, carotenóides naturais para intensificar o brilho das cores e alho fresco como antiparasitário profilático.',
    badgeColor: 'border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff]',
    ingredients: [
      { item: 'Filé de tilápia ou peixe branco magro', amount: '200g', purpose: 'Proteína nobre de alta digestibilidade e baixo teor de gordura' },
      { item: 'Camarão fresco cru (sem casca nem cabeça)', amount: '100g', purpose: 'Rico em astaxantina natural para pigmentação e palatabilidade' },
      { item: 'Folhas de espinafre frescas', amount: '1 xícara', purpose: 'Fibras e ferro vegetal (branquear em água fervente por 1 min)' },
      { item: 'Cenoura média cozida no vapor', amount: '1/2 unidade', purpose: 'Fonte abundante de betacaroteno para realce de vermelhos e laranjas' },
      { item: 'Dente de alho fresco amassado', amount: '1 dente pequeno', purpose: 'Fonte de alicina: estimulante de apetite e bactericida natural' },
      { item: 'Spirulina 100% pura em pó', amount: '1 colher de chá', purpose: 'Superalimento antioxidante e reforço do sistema imune' },
      { item: 'Ágar-ágar ou gelatina incolor sem sabor', amount: '1 sachê (10g–12g)', purpose: 'Agente gelificante que impede a ração de esfarelar e turvar a água' }
    ],
    steps: [
      'Cozinhe a cenoura e branqueie o espinafre em água fervente por 60 segundos; escorra bem.',
      'No processador de alimentos, adicione o peixe, o camarão, os vegetais, o alho e a spirulina. Triture até obter uma pasta homogênea e aveludada.',
      'Dissolva o ágar-ágar (ou gelatina) em cerca de 80ml de água morna conforme as instruções da embalagem até ficar totalmente líquida.',
      'Incorpore a gelatina morna à pasta proteica no processador e pulse rapidamente por 10 segundos para homogeneizar.',
      'Despeje imediatamente em forminhas de gelo ou espalhe em uma travessa com espessura de 1 cm coberta com plástico filme.',
      'Leve à geladeira por 1 hora até firmar, corte em pequenos cubos de dose individual e guarde em pote hermético no congelador.'
    ],
    feedingTip:
      'Retire um cubo do freezer 5 minutos antes de servir e corte pequenas lascas proporcionais ao tamanho da boca dos peixes. Nunca jogue o cubo inteiro congelado na água.'
  },
  {
    id: 'gel-verde-herbivoro',
    title: 'Gel Verde de Spirulina & Vegetais (Fundo & Cascudos)',
    targetSpecies: 'Otocinclus, Coridoras, Cascudos Ancistrus, Molinésias e Camarões',
    prepTime: '20 minutos',
    difficulty: 'Fácil',
    yields: '~30 porções / pedras revestidas',
    shelfLife: 'Até 90 dias no freezer (-18°C)',
    description:
      'Desenvolvido especificamente para comedores de algas e peixes que se alimentam raspando superfícies no fundo do aquário, rico em fibras vegetais anti-prisão de ventre.',
    badgeColor: 'border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]',
    ingredients: [
      { item: 'Abobrinha italiana fresca com casca', amount: '1 unidade média', purpose: 'Massa vegetal suave e rica em água biológica' },
      { item: 'Ervilhas frescas cozidas (sem a casquinha)', amount: '1/2 xícara', purpose: 'Regulador gastrointestinal que previne hidropisia' },
      { item: 'Couve-manteiga branqueada', amount: '1 folha grande', purpose: 'Aporte concentrado de cálcio e vitamina K' },
      { item: 'Spirulina pura em pó', amount: '2 colheres de sopa cheias', purpose: 'Replica a concentração natural do biofilme de algas (aufwuchs)' },
      { item: 'Gotas de óleo de peixe ou ômega-3', amount: '3 a 4 gotas', purpose: 'Ácidos graxos essenciais para vitalidade das membranas celulares' },
      { item: 'Ágar-ágar em pó', amount: '15g (fórmula mais firme)', purpose: 'Cria consistência elástica que resiste à água corrente sem dissolver' }
    ],
    steps: [
      'Cozinhe a abobrinha no vapor até amaciar. Remova as cascas das ervilhas após o cozimento suave.',
      'Processe a abobrinha, ervilhas, couve e spirulina até virar um purê verde-esmeralda denso.',
      'Dissolva o ágar-ágar em 100ml de água fervente e misture vigorosamente ao purê.',
      'Técnica das Pedras de Algas: pincele a mistura ainda quente sobre rochas vulcânicas ou de rio limpas e deixe esfriar na geladeira. O gel formará uma crosta firme que os cascudos adoram raspar!',
      'O restante da massa pode ser despejado em formas de bombom ou gelo e congelado normalmente.'
    ],
    feedingTip:
      'Coloque a pedra ou cubo no fundo do aquário próximo ao anoitecer, horário em que peixes de fundo e cascudos estão mais ativos na busca de alimento.'
  },
  {
    id: 'pate-imunologico-alho',
    title: 'Gel Terapêutico de Alho & Quarentena (Imunidade Reforçada)',
    targetSpecies: 'Peixes em Quarentena, Aclimatados Recentes ou com Apetite Reduzido',
    prepTime: '15 minutos',
    difficulty: 'Fácil',
    yields: '~20 micro-cubos',
    shelfLife: 'Até 60 dias no freezer',
    description:
      'Fórmula com alta concentração de suco de alho fresco prensado a frio, rica em alicina ativa para fortalecimento imunológico e eliminação de vermes intestinais.',
    badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    ingredients: [
      { item: 'Filé de peixe branco fresco', amount: '150g', purpose: 'Base proteica atrativa de odor suave' },
      { item: 'Dentes de alho frescos prensados a frio', amount: '3 dentes médios', purpose: 'Alicina natural pura: potente antimicrobiano e antiparasitário' },
      { item: 'Complexo vitamínico para aquários (gotas)', amount: '5 gotas', purpose: 'Reposição rápida de micronutrientes para peixes estressados' },
      { item: 'Spirulina em pó', amount: '1 colher de sobremesa', purpose: 'Reforço antioxidante' },
      { item: 'Gelatina sem sabor', amount: '1 pacote pequeno', purpose: 'Liga compacta' }
    ],
    steps: [
      'Amasse os dentes de alho e deixe descansar por 5 minutos ao ar livre (isso ativa quimicamente a conversão da alina em alicina).',
      'Triture o peixe cru com o suco de alho e a spirulina.',
      'Acrescente o complexo vitamínico e a gelatina previamente dissolvida em água morna.',
      'Misture, molde em placas finas de 0,5 cm e leve ao congelador.',
      'Corte em cubinhos do tamanho de um grão de arroz para facilitar a ingestão rápida.'
    ],
    feedingTip:
      'Utilize como alimento exclusivo por 5 a 7 dias durante quarentenas ou logo após a introdução de novos peixes no aquário.'
  }
];

export function FishFoodGuide() {
  const [activeTab, setActiveTab] = useState<'commercial' | 'recipes' | 'rules'>('recipes');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('pate-tropical');

  const selectedRecipe = RECIPES.find((r) => r.id === selectedRecipeId) || RECIPES[0];

  return (
    <div className="space-y-8">
      {/* Hero Banner with Food Guide */}
      <div className="relative overflow-hidden rounded-2xl border border-[#1a2c40] bg-[#121f2d] shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="p-6 sm:p-8 lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-md bg-[#00f0ff]/10 px-2.5 py-1 text-xs font-semibold text-[#00f0ff]">
              <Utensils className="h-3.5 w-3.5" />
              <span>Nutrição & Gastronomia Aquática</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-[#f0f4f8] sm:text-3xl">
              Alimentação de Peixes & Receitas de Ração Caseira
            </h2>

            <p className="text-xs leading-relaxed text-[#94a3b8] sm:text-sm">
              Uma dieta balanceada previne doenças, intensifica as cores naturais e prolonga a longevidade dos peixes. Aprenda a combinar rações industriais de primeira linha com deliciosos patês caseiros nutritivos e seguros.
            </p>

            <div className="flex flex-wrap gap-2 pt-2 text-xs">
              <span className="rounded-md border border-[#1a2c40] bg-[#0a1118] px-3 py-1 text-[#cbd5e1]">
                Sem conservantes químicos
              </span>
              <span className="rounded-md border border-[#1a2c40] bg-[#0a1118] px-3 py-1 text-[#cbd5e1]">
                Com alicina bactericida
              </span>
              <span className="rounded-md border border-[#1a2c40] bg-[#0a1118] px-3 py-1 text-[#cbd5e1]">
                Não turva a água
              </span>
            </div>
          </div>

          <div className="relative h-64 lg:h-full lg:col-span-5 overflow-hidden">
            <img
              src="/src/assets/images/racao_peixes_guia_1794062891857.jpg"
              alt="Ingredientes naturais frescos para ração caseira de aquário"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121f2d] via-transparent to-transparent lg:bg-gradient-to-l" />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#1a2c40]/80 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('recipes')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors ${
            activeTab === 'recipes'
              ? 'bg-[#00f0ff] text-[#0a1118]'
              : 'border border-[#1a2c40] bg-[#121f2d] text-[#94a3b8] hover:text-[#f0f4f8]'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Receitas Caseiras Passo a Passo (3)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('commercial')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors ${
            activeTab === 'commercial'
              ? 'bg-[#00f0ff] text-[#0a1118]'
              : 'border border-[#1a2c40] bg-[#121f2d] text-[#94a3b8] hover:text-[#f0f4f8]'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Tipos de Rações Comerciais</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors ${
            activeTab === 'rules'
              ? 'bg-[#00f0ff] text-[#0a1118]'
              : 'border border-[#1a2c40] bg-[#121f2d] text-[#94a3b8] hover:text-[#f0f4f8]'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Regras de Ouro & Erros Fatais</span>
        </button>
      </div>

      {/* TAB 1: RECIPES */}
      {activeTab === 'recipes' && (
        <div className="space-y-6">
          {/* Recipe selector pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {RECIPES.map((recipe) => (
              <button
                key={recipe.id}
                type="button"
                onClick={() => setSelectedRecipeId(recipe.id)}
                className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                  selectedRecipeId === recipe.id
                    ? 'border-[#00f0ff] bg-[#00f0ff]/10 shadow-sm'
                    : 'border-[#1a2c40] bg-[#121f2d] hover:border-[#334e68]'
                }`}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#00f0ff]">
                  Receita Artesanal
                </span>
                <span className="mt-1 text-sm font-bold text-[#f0f4f8] leading-tight">
                  {recipe.title}
                </span>
                <span className="mt-2 text-xs text-[#94a3b8] line-clamp-1">
                  {recipe.targetSpecies}
                </span>
              </button>
            ))}
          </div>

          {/* Detailed Selected Recipe Card */}
          <div className="rounded-2xl border border-[#1a2c40] bg-[#121f2d] p-6 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-[#1a2c40] pb-6">
              <div>
                <span className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-medium uppercase ${selectedRecipe.badgeColor}`}>
                  {selectedRecipe.targetSpecies}
                </span>
                <h3 className="mt-2 text-xl font-bold text-[#f0f4f8] sm:text-2xl">
                  {selectedRecipe.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#cbd5e1] sm:text-sm">
                  {selectedRecipe.description}
                </p>
              </div>

              {/* Fast Stats */}
              <div className="flex sm:flex-col gap-3 shrink-0 text-xs">
                <div className="rounded-lg border border-[#1a2c40] bg-[#0a1118] px-3 py-2 text-center">
                  <span className="text-[#94a3b8] block text-[10px] uppercase">Preparo</span>
                  <strong className="text-[#f0f4f8]">{selectedRecipe.prepTime}</strong>
                </div>
                <div className="rounded-lg border border-[#1a2c40] bg-[#0a1118] px-3 py-2 text-center">
                  <span className="text-[#94a3b8] block text-[10px] uppercase">Rendimento</span>
                  <strong className="text-[#00f0ff]">{selectedRecipe.yields}</strong>
                </div>
                <div className="rounded-lg border border-[#1a2c40] bg-[#0a1118] px-3 py-2 text-center">
                  <span className="text-[#94a3b8] block text-[10px] uppercase">Validade</span>
                  <strong className="text-[#22c55e]">{selectedRecipe.shelfLife}</strong>
                </div>
              </div>
            </div>

            {/* Ingredients table */}
            <div>
              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#00f0ff]">
                <Utensils className="h-4 w-4" />
                Ingredientes Necessários
              </h4>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#1a2c40] text-[#94a3b8]">
                      <th className="py-2.5 px-3 font-semibold">Ingrediente</th>
                      <th className="py-2.5 px-3 font-semibold text-[#00f0ff]">Quantidade</th>
                      <th className="py-2.5 px-3 font-semibold">Benefício para os Peixes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a2c40]/60">
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <tr key={idx} className="hover:bg-[#0a1118]/50">
                        <td className="py-2.5 px-3 font-semibold text-[#f0f4f8]">
                          {ing.item}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-[#00f0ff] tabular-nums">
                          {ing.amount}
                        </td>
                        <td className="py-2.5 px-3 text-[#cbd5e1]">
                          {ing.purpose}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step by step */}
            <div>
              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#22c55e]">
                <Clock className="h-4 w-4" />
                Modo de Preparo Passo a Passo
              </h4>
              <ol className="mt-3 space-y-2.5 text-xs text-[#cbd5e1]">
                {selectedRecipe.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 rounded-xl border border-[#1a2c40]/70 bg-[#0c1622] p-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00f0ff]/20 text-[11px] font-bold text-[#00f0ff]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Feeding Tip */}
            <div className="rounded-xl border border-[#00f0ff]/30 bg-[#00f0ff]/10 p-4 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-[#00f0ff]">
                <Info className="h-4 w-4" />
                Como Servir Corretamente:
              </span>
              <p className="mt-1 text-[#cbd5e1] leading-relaxed">
                {selectedRecipe.feedingTip}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMMERCIAL FOODS */}
      {activeTab === 'commercial' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[#1a2c40] bg-[#121f2d] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#f0f4f8]">
                1. Ração em Flocos (Flakes)
              </h3>
              <span className="text-xs text-[#00f0ff] font-medium">Superfície</span>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Desenvolvida para boiar na lâmina superior da água por tempo prolongado. Ideal para peixes cuja morfologia bucal é virada para cima (superior).
            </p>
            <div className="rounded-lg bg-[#0a1118] p-3 text-xs space-y-1 text-[#cbd5e1]">
              <p><strong>Espécies Indicadas:</strong> Lebistes (Guppies), Platys, Espadas, Betta splendens e pequenos tetras.</p>
              <p className="text-[#64748b]"><strong>Atenção:</strong> Flocos que afundam e não são consumidos se decompõem rapidamente no substrato.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1a2c40] bg-[#121f2d] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#f0f4f8]">
                2. Micro-Grânulos & Pellets de Afundamento Lento
              </h3>
              <span className="text-xs text-[#38bdf8] font-medium">Meio d'água</span>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Mergulham suavemente pela coluna d'água, simulando a queda natural de insetos e larvas na correnteza. Mantêm o valor nutricional por mais tempo sem esfarelar.
            </p>
            <div className="rounded-lg bg-[#0a1118] p-3 text-xs space-y-1 text-[#cbd5e1]">
              <p><strong>Espécies Indicadas:</strong> Acarás-Disco, Acarás-Bandeira, Tetras Cardinais, Rodóstomos, Rasboras e Ciclídeos anões.</p>
              <p className="text-[#64748b]"><strong>Vantagem:</strong> Menor dissolução de fosfatos na água comparado a flocos baratos.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1a2c40] bg-[#121f2d] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#f0f4f8]">
                3. Wafers & Pastilhas de Fundo com Spirulina
              </h3>
              <span className="text-xs text-[#22c55e] font-medium">Fundo</span>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Discos densos e prensados que afundam imediatamente e mantêm a consistência por horas para serem pastados por peixes de fundo com ventosa bucal ou barbilhões.
            </p>
            <div className="rounded-lg bg-[#0a1118] p-3 text-xs space-y-1 text-[#cbd5e1]">
              <p><strong>Espécies Indicadas:</strong> Coridoras, Cascudos (Loricariidae), Otocinclus, Cobitídeos e Camarões Neocaridina.</p>
              <p className="text-[#64748b]"><strong>Dica:</strong> Oferecer após apagar as luzes do aquário para evitar que os peixes de meio roubem a comida.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1a2c40] bg-[#121f2d] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#f0f4f8]">
                4. Alimentos Liofilizados & Vivos (Bloodworms, Artemia)
              </h3>
              <span className="text-xs text-amber-300 font-medium">Estímulo & Reprodução</span>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Alimentos desidratados a frio ou congelados ricos em proteínas puras e caroteno. Atuam como excelente gatilho reprodutivo e estimulante de apetite.
            </p>
            <div className="rounded-lg bg-[#0a1118] p-3 text-xs space-y-1 text-[#cbd5e1]">
              <p><strong>Variedades:</strong> Larvas de mosquito vermelhas (bloodworms), cistos de artêmia salina descapsulados, dáfnias e tubifex higienizado.</p>
              <p className="text-[#64748b]"><strong>Frequência:</strong> 1 a 2 vezes por semana como guloseima especial, nunca como ração única.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GOLDEN RULES */}
      {activeTab === 'rules' && (
        <div className="rounded-2xl border border-[#1a2c40] bg-[#121f2d] p-6 shadow-md space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#f0f4f8]">
              As Regras de Ouro da Nutrição em Aquários
            </h3>
            <p className="text-xs text-[#94a3b8]">
              Mais de 80% dos problemas de amônia e morte precoce de peixes decorrem de excesso de comida:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl border border-[#1a2c40] bg-[#0c1622] p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#00f0ff] font-semibold">
                <Clock className="h-4 w-4" />
                <span>A Regra dos 2 Minutos</span>
              </div>
              <p className="text-[#cbd5e1] leading-relaxed">
                Toda a comida oferecida deve ser consumida completamente em até 2 minutos. Se sobrou alimento no fundo ou flutuando após esse tempo, você exagerou na dosagem.
              </p>
            </div>

            <div className="rounded-xl border border-[#1a2c40] bg-[#0c1622] p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#22c55e] font-semibold">
                <Heart className="h-4 w-4" />
                <span>O Dia do Jejum Semanal</span>
              </div>
              <p className="text-[#cbd5e1] leading-relaxed">
                Em peixes adultos saudáveis, mantenha um dia por semana (ex: todo domingo) sem fornecer nenhuma alimentação. Isso esvazia o trato intestinal e previne a fatal constipação/hidropisia.
              </p>
            </div>

            <div className="rounded-xl border border-[#1a2c40] bg-[#0c1622] p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <ShieldCheck className="h-4 w-4" />
                <span>Rotação de Alimentos</span>
              </div>
              <p className="text-[#cbd5e1] leading-relaxed">
                Nenhuma ração comercial possui todos os nutrientes ideais. Intercale ração básica com pastilhas de spirulina, bloodworms e o patê caseiro durante os dias da semana.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-red-900/30 bg-[#0a1118]/80 p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold">
              <AlertTriangle className="h-4 w-4" />
              <span>O que NUNCA fazer com comida caseira para peixes:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[#94a3b8]">
              <li><strong>Jamais usar sal ou temperos:</strong> Alho é o único tempero aceito (cru e sem aditivos). Sal e pimenta atacam o sistema osmótico dos peixes de água doce.</li>
              <li><strong>Evitar carnes gordurosas terrestres:</strong> Carne de vaca, porco e frango possuem lipídios saturados que se acumulam no fígado dos peixes tropicais e poluem gravemente a água.</li>
              <li><strong>Não recongelar patê descongelado:</strong> Descongele apenas a lasca que será consumida imediatamente.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
