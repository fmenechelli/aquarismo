# Aquafilia - Guia de Aquarismo de Água Doce

Plataforma interativa de referência para pesquisa biológica, cálculo de compatibilidade e maturação de aquários de água doce (peixes, plantas e química da água).

---

## 🚀 Como Publicar no GitHub e Netlify

### Passo 1: Subir o Código para o GitHub

Se ainda não inicializou o repositório Git localmente:

```bash
# 1. Inicializar o Git
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Criar o commit inicial
git commit -m "feat: projeto inicial Aquafilia"

# 4. Criar um novo repositório no seu GitHub (ex: https://github.com/seu-usuario/aquafilia)
# 5. Conectar a branch principal e o repositório remoto
git branch -M main
git remote add origin https://github.com/seu-usuario/aquafilia.git

# 6. Fazer o push
git push -u origin main
```

---

### Passo 2: Publicar no Netlify (Deploy Contínuo)

O projeto já contém os arquivos `netlify.toml` e `public/_redirects` devidamente configurados para Single Page Application (SPA).

#### Método A (Recomendado - Conexão Direta com o GitHub):
1. Acesse [netlify.com](https://www.netlify.com/) e faça login com sua conta do GitHub.
2. Clique no botão **"Add new site"** > **"Import an existing project"**.
3. Selecione **GitHub** e escolha o repositório `aquafilia`.
4. As configurações de compilação serão detectadas automaticamente pelo arquivo `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Clique em **"Deploy site"**.
6. Pronto! A cada novo `git push` enviado para a branch `main`, o Netlify publicará a versão atualizada automaticamente.

#### Método B (Deploy Manual via Netlify CLI):
```bash
# 1. Instalar a CLI do Netlify globalmente
npm install -g netlify-cli

# 2. Gerar a build de produção
npm run build

# 3. Publicar diretamente
netlify deploy --prod --dir=dist
```

---

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (porta 3000)
npm run dev

# Gerar build otimizada de produção
npm run build

# Pré-visualizar a build localmente
npm run preview
```

---

## 📂 Estrutura do Projeto

```
├── .gitignore              # Arquivos e pastas ignorados pelo Git e Netlify
├── netlify.toml            # Configuração de build, cabeçalhos e redirects do Netlify
├── package.json            # Scripts e dependências do projeto
├── public/
│   └── _redirects          # Regra de roteamento SPA para o Netlify
├── src/
│   ├── components/
│   │   ├── AquariumPlanner.tsx   # Simulador de compatibilidade biológica
│   │   ├── BiotopeGuide.tsx      # Guias de biótopos naturais
│   │   ├── CyclingGuide.tsx      # Guia passo a passo de ciclagem do nitrogênio
│   │   ├── ParameterQuickRef.tsx # Tabela de referência físico-química da água
│   │   ├── SpeciesCard.tsx       # Cartão de exibição das espécies
│   │   └── SpeciesModal.tsx      # Ficha biológica detalhada com medidores de pH/Temp
│   ├── data/
│   │   └── speciesData.ts        # Catálogo com parâmetros de peixes e plantas
│   ├── types/
│   │   └── aquarium.ts           # Modelos de dados e tipos TypeScript
│   ├── App.tsx                   # Componente raiz da aplicação
│   ├── index.css                 # Estilos globais e Tailwind CSS
│   └── main.tsx                  # Ponto de entrada React
├── tsconfig.json           # Configurações do compilador TypeScript
└── vite.config.ts          # Configurações do Vite
```

---

## 🔒 Licença & Direitos

Projeto desenvolvido com fins educacionais para promoção do bem-estar animal e aquarismo responsável.
