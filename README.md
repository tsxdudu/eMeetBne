# LiveMeet - Clone do Google Meet

Um clone do Google Meet desenvolvido com Next.js 15, TypeScript, Tailwind CSS e LiveKit para videoconferências em tempo real.

## 🚀 Funcionalidades

- ✅ **Criação de Salas**: Crie salas públicas ou privadas com senha
- ✅ **Videoconferência em Tempo Real**: Áudio e vídeo de alta qualidade usando LiveKit
- ✅ **Compartilhamento de Tela**: Compartilhe sua tela com outros participantes
- ✅ **Chat em Tempo Real**: Converse com participantes durante a chamada
- ✅ **Lista de Participantes**: Veja quem está na sala
- ✅ **Controles de Mídia**: Ligue/desligue câmera e microfone
- ✅ **Interface Responsiva**: Funciona em desktop e mobile
- ✅ **Salas com Senha**: Proteja suas salas com senhas personalizadas

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **LiveKit** - Solução de videoconferência em tempo real
- **Lucide React** - Ícones modernos

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no LiveKit Cloud (ou servidor LiveKit próprio)

## ⚙️ Configuração

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd livemeet
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env.local` na raiz do projeto:
   ```env
   LIVEKIT_URL=wss://seu-endpoint.livekit.cloud
   LIVEKIT_API_KEY=sua-api-key
   LIVEKIT_API_SECRET=seu-api-secret
   ```

   > 💡 **Como obter as credenciais do LiveKit:**
   > 1. Acesse [LiveKit Cloud](https://cloud.livekit.io)
   > 2. Crie uma conta gratuita
   > 3. Crie um novo projeto
   > 4. Copie as credenciais do dashboard

4. **Execute o projeto**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 🎯 Como Usar

### Criando uma Sala

1. Na página inicial, clique em **"Criar Nova Sala"**
2. Digite um nome para a sala
3. Escolha se a sala será pública ou privada
4. Se privada, defina uma senha
5. Clique em **"Criar Sala"**
6. A sala será criada e aparecerá na lista de salas públicas (se for pública)

### Entrando em uma Sala

**Método 1 - Salas Públicas:**
1. Digite seu nome no campo na página inicial
2. Clique em **"Entrar"** em qualquer sala pública

**Método 2 - ID da Sala:**
1. Clique em **"Entrar em Sala"**
2. Digite seu nome
3. Cole o ID da sala
4. Digite a senha (se necessário)
5. Clique em **"Entrar na Sala"**

### Durante a Chamada

- **Controles de Mídia**: Use os botões na parte inferior para ligar/desligar câmera e microfone
- **Compartilhar Tela**: Clique no ícone de monitor para compartilhar sua tela
- **Lista de Participantes**: Clique no ícone de usuários para ver todos os participantes
- **Chat**: Use o ícone de mensagem para abrir o chat
- **Configurações**: Ajuste qualidade de vídeo e dispositivos
- **Copiar Link**: Compartilhe o link da sala com outros participantes
- **Sair da Sala**: Clique no botão vermelho para deixar a chamada

## 🏗️ Estrutura do Projeto

```
├── app/
│   ├── api/
│   │   └── rooms/           # Endpoints da API
│   ├── room/
│   │   └── [roomId]/        # Página da sala dinâmica
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página inicial
├── components/
│   └── LiveKitWrapper.tsx   # Wrapper para componentes LiveKit
├── hooks/
│   └── useRoomState.ts      # Hook para estado da sala
├── lib/
│   ├── livekit-token.ts     # Geração de tokens LiveKit
│   └── room-manager.ts      # Gerenciamento de salas
├── types/
│   └── room.ts              # Tipos TypeScript
└── .env                     # Variáveis de ambiente
```

## 🔧 Personalização

### Modificando Estilos

Os estilos estão implementados com Tailwind CSS. Para personalizar:

1. Edite as classes nos componentes
2. Modifique `tailwind.config.js` para cores e temas customizados
3. Adicione CSS customizado em `app/globals.css`

### Adicionando Funcionalidades

- **Gravação**: Implemente gravação usando a API do LiveKit
- **Filtros de Vídeo**: Adicione filtros e efeitos de vídeo
- **Breakout Rooms**: Crie salas separadas dentro da principal
- **Autenticação Avançada**: Integre com provedores OAuth

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente no dashboard
3. Deploy automático a cada push

### Outros Provedores

O projeto pode ser deployado em qualquer provedor que suporte Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `LIVEKIT_URL` | URL do servidor LiveKit | `wss://projeto.livekit.cloud` |
| `LIVEKIT_API_KEY` | Chave da API do LiveKit | `API2xyz...` |
| `LIVEKIT_API_SECRET` | Secret da API do LiveKit | `w2orUBI6...` |

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Confirme se as credenciais do LiveKit estão corretas
3. Abra uma issue no GitHub com detalhes do problema

## 🎉 Demo

Para testar rapidamente:
1. Crie uma sala pública
2. Abra em duas abas diferentes do navegador
3. Entre com nomes diferentes
4. Teste vídeo, áudio e compartilhamento de tela

---

Desenvolvido com ❤️ usando Next.js e LiveKit
