# 🔍 HTTP Toolkit para Termux

Um toolkit profissional e complexo para interceptar, analisar e debugar tráfego HTTP/HTTPS no Termux.

## ✨ Características

- 🛡️ **Proxy HTTPS avançado** - Intercepte e analise tráfego criptografado
- 📊 **Dashboard em tempo real** - Interface moderna com WebSocket
- 🔐 **Autenticação segura** - JWT com hash bcrypt
- 📝 **Logging profissional** - Winston com múltiplos níveis
- 🔄 **Request/Response Mock** - Simule respostas personalizadas
- 📈 **Análise de tráfego** - Estatísticas detalhadas
- 🎯 **Filtros avançados** - Por URL, método, headers, status
- 💾 **Persistência de dados** - Salve sessões de análise
- 🚀 **Performance otimizada** - Requisições paralelas
- 📱 **Compatível com Termux** - Otimizado para dispositivos móveis

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor
npm start
```

## 📁 Estrutura do Projeto

```
├── src/
│   ├── server/          # Backend Express
│   │   ├── index.ts     # Entrada principal
│   │   ├── middleware/  # Middlewares
│   │   ├── routes/      # Rotas da API
│   │   ├── controllers/ # Controllers
│   │   ├── services/    # Lógica de negócio
│   │   ├── proxy/       # Configuração do proxy
│   │   ├── auth/        # Autenticação
│   │   ├── database/    # Banco de dados
│   │   └── utils/       # Utilitários
│   └── client/          # Frontend React
│       ├── index.tsx
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── types/
├── dist/                # Output compilado
├── tests/               # Testes
└── docs/                # Documentação
```

## 🔧 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

### Interceptação
- `GET /api/requests` - Listar requisições
- `GET /api/requests/:id` - Detalhes da requisição
- `DELETE /api/requests/:id` - Deletar requisição
- `POST /api/requests/:id/replay` - Replay de requisição

### Análise
- `GET /api/analytics/stats` - Estatísticas gerais
- `GET /api/analytics/by-domain` - Por domínio
- `GET /api/analytics/by-status` - Por status HTTP

### Configuração
- `GET /api/config` - Obter configurações
- `PUT /api/config` - Atualizar configurações
- `POST /api/config/certificates` - Gerenciar certificados

## 🔌 WebSocket Events

- `request:new` - Nova requisição interceptada
- `request:updated` - Requisição atualizada
- `analytics:update` - Atualização de estatísticas
- `proxy:status` - Status do proxy

## 🛡️ Segurança

- ✅ JWT com expiração configurável
- ✅ Hash bcrypt para senhas
- ✅ CORS configurável
- ✅ Rate limiting
- ✅ Validação de entrada
- ✅ Certificados SSL/TLS auto-assinados

## 📖 Documentação

Veja a pasta `docs/` para documentação detalhada.

## 🧪 Testes

```bash
npm test
```

## 📝 Licença

MIT
