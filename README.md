# 🦕 RawrKô — Suas tarefas na era dos dinos

> Roaaar! Organize-se sem virar fóssil. 💚

**RawrKô** é um Progressive Web App (PWA) de lista de tarefas com tema de
dinossauros fofos, feito com **HTML, CSS e JavaScript puro** — sem frameworks,
sem build, 100% offline.

## ✨ Funcionalidades

- ✅ Adicionar, editar (toque no ✏️) e excluir tarefas
- 💖 Concluir tarefas com um toque (o coração enche!)
- 🦕 Categorias fofas: Estudo, Casa, Lazer e Importante
- 🔴 Prioridades: baixa, média e alta (cor da borda do card)
- 🔍 Busca + filtros por estado e por categoria
- 📅 Prazo opcional, com destaque para tarefas atrasadas
- 📊 Barra de progresso do dia
- ↩️ Desfazer exclusão
- 🎉 Confete quando todas as tarefas são concluídas
- 🦖 Mascote dinossauro que reage às suas ações (dorme, comemora...)
- 💾 Persistência em `localStorage` (os dados ficam salvos no aparelho)
- 🌙 Modo claro/escuro automático
- 📲 Instalável como aplicativo (PWA) e funcional **offline**

## 🧩 Tecnologias

| Camada | Tecnologia |
|---|---|
| Estrutura | HTML5 semântico |
| Estilo | CSS3 Mobile First (paleta pastel, animações, dark mode) |
| Lógica | JavaScript Vanilla (ES6+) |
| PWA | `manifest.json` + Service Worker (cache offline) |
| Ícones | Desenhados com Python/PIL (ver `icons/make_icons.py`) |

## 🚀 Como rodar localmente

**Backend** (opcional — sem ele o app funciona em modo offline):

```bash
cd backend
npm install
npm start          # API em http://localhost:3000
```

**Frontend** (service worker exige localhost ou HTTPS):

```bash
cd frontend
python3 -m http.server 8080
# abra http://localhost:8080
```

> Para usar a API local, troque a URL em `frontend/js/api.js`
> para `http://localhost:3000`.

## 📲 Como instalar no celular

1. Acesse o app pelo navegador (Chrome no Android, Safari no iOS).
2. **Android**: toque em "Instalar app" no cabeçalho, ou menu ⋮ → *Adicionar à tela inicial*.
3. **iOS**: botão *Compartilhar* → *Adicionar à Tela de Início*.
4. Pronto! O app abre em tela cheia, como um aplicativo nativo — até sem internet. 📡

## 🌍 Publicação

| Serviço | Tipo Render | Link |
|---|---|---|
| Frontend (PWA) | Static Site | `https://rawrko-pwa.onrender.com` |
| Backend (API REST) | Web Service (Node) | `https://rawrko-api.onrender.com` |

O frontend sincroniza as tarefas com a API REST. Sem internet (ou com a
API do plano gratuito "dormindo"), o app segue funcionando em modo offline
com o `localStorage` — e sincroniza quando a conexão volta. 📡

> ⚙️ A URL da API fica configurada em `frontend/js/api.js`.

## 📁 Estrutura

```
rawrko-pwa/
├── frontend/               # PWA — Static Site no Render
│   ├── index.html          # página única do app
│   ├── css/style.css       # tema fofo pastel, mobile first
│   ├── js/api.js           # cliente da API REST (fetch + fallback)
│   ├── js/app.js           # lógica das tarefas
│   ├── js/sw.js            # service worker (offline)
│   ├── manifest.json       # configuração do PWA
│   └── icons/              # ícones 192/512 + maskable
├── backend/                # API REST — Web Service no Render
│   ├── server.js           # rotas GET/POST/PUT/DELETE /tasks
│   └── package.json
└── frontend/icons/make_icons.py  # gerador dos ícones (PIL)
```

---

Feito com 💚 por dinos fofos · RawrKô PWA
