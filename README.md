📱 Foco Total


Aplicativo mobile de bem-estar digital que ajuda você a reduzir distrações, manter o foco e desenvolver hábitos mais saudáveis de uso do smartphone.




🧠 Sobre o projeto

Foco Total é um app desenvolvido com React Native + Expo voltado para pessoas que querem retomar o controle do próprio tempo e atenção. O app combina técnicas de produtividade (como o Pomodoro) com monitoramento de uso de aplicativos e insights gerados por inteligência artificial.


✨ Funcionalidades

🏠 Tela Inicial — Sessão de Foco


Timer de foco com durações de 25, 45 ou 60 minutos
Barra de progresso em tempo real durante a sessão
Monitoramento de saída do app: ao retornar, o usuário vê quanto tempo ficou fora
Bloqueio do botão Voltar no Android durante a sessão ativa
Lista de apps monitorados (Instagram, TikTok, Facebook, Twitter/X, YouTube) com toggle individual
Atalho direto para o Bem-estar Digital (Android) ou Screen Time (iOS)
Insight motivacional dinâmico baseado no progresso do dia


📊 Análise de Bem-Estar


Insight personalizado por IA (Claude via API da Anthropic) gerado a partir dos dados reais do usuário
Resumo diário: sessões de foco e tempo em redes sociais
Gráfico semanal de tempo em redes sociais
Gráfico semanal de sessões de foco concluídas
Tempo por aplicativo com indicação visual quando o limite é ultrapassado
Acompanhamento do progresso das metas do dia


🎯 Metas Diárias


Criação, conclusão e exclusão de metas personalizadas
Progresso em percentual com barra visual
Separação entre metas pendentes e concluídas
Persistência local via AsyncStorage


⚙️ Configurações


Ajuste do limite diário de tempo em redes sociais
Definição da meta de sessões de foco por dia


🔐 Autenticação


Telas de Login, Cadastro e Recuperação de senha



🛠️ Tecnologias utilizadas

TecnologiaVersãoReact Native0.81.5Expo~54.0.33TypeScript~5.9.2React Navigationv7Expo Linear Gradient~15.0.8AsyncStorage2.2.0Expo Vector Icons^15.0.3React Native Reanimated~4.1.1Anthropic API (Claude)claude-sonnet-4


🚀 Como rodar o projeto

Pré-requisitos


Node.js (versão LTS recomendada)
Expo CLI
Aplicativo Expo Go no celular (iOS ou Android) ou um emulador configurado


Instalação

bash# Clone o repositório
git clone https://github.com/robsondev98/foco-total.git

# Entre na pasta do projeto
cd foco-total

# Instale as dependências
npm install

Executando

bash# Inicia o servidor de desenvolvimento
npm start

# Para Android
npm run android

# Para iOS
npm run ios

# Para Web
npm run web

Escaneie o QR Code com o app Expo Go ou pressione a (Android) / i (iOS) no terminal.


📁 Estrutura do projeto

src/
├── assets/
│   └── fonts/              # Fontes customizadas
├── context/
│   └── AppContext.tsx       # Estado global (metas, sessões, configurações)
├── navigation/
│   └── AppNavigator.tsx     # Navegação (Stack + Bottom Tabs)
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── ForgotPasswordScreen.tsx
│   ├── HomeScreen.tsx       # Timer de foco + apps monitorados
│   ├── AnalysisScreen.tsx   # Análise + insight por IA
│   ├── GoalsScreen.tsx      # Metas diárias
│   ├── SettingsScreen.tsx   # Configurações
│   └── FocusLockScreen.tsx  # Modal de retorno durante sessão
└── services/
    └── FocusLockService.ts  # Serviço de detecção de saída do app


🤖 Integração com IA

A tela de Análise utiliza a API da Anthropic (Claude) para gerar insights personalizados com base nos dados reais do usuário:


Número de sessões de foco concluídas vs. meta
Tempo gasto em redes sociais vs. limite definido
Quantidade de metas diárias concluídas


O insight é gerado automaticamente ao abrir a tela e pode ser atualizado manualmente.


Nota: para usar essa funcionalidade em produção, é necessário configurar a chave de API da Anthropic.




📌 Observações


O bloqueio de aplicativos é feito via FocusLockService, um serviço em JavaScript puro compatível com Expo. Ele monitora o estado do app (AppState) e detecta quando o usuário sai durante uma sessão, exibindo uma tela de retorno ao voltar.
Para bloqueio nativo de aplicativos de terceiros, o usuário é direcionado às configurações do sistema (Bem-estar Digital no Android / Screen Time no iOS), pois esse nível de controle requer permissões de sistema não disponíveis no Expo padrão.
Os dados de uso de aplicativos exibidos nos gráficos são simulados nesta versão.
