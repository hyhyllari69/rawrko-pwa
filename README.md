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

O service worker exige HTTPS ou `localhost`. Na pasta do projeto:

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

## 📲 Como instalar no celular

1. Acesse o app pelo navegador (Chrome no Android, Safari no iOS).
2. **Android**: toque em "Instalar app" no cabeçalho, ou menu ⋮ → *Adicionar à tela inicial*.
3. **iOS**: botão *Compartilhar* → *Adicionar à Tela de Início*.
4. Pronto! O app abre em tela cheia, como um aplicativo nativo — até sem internet. 📡

## 🌍 Publicação

- **Código-fonte**: [GitHub](https://github.com/SEU-USUARIO/rawrko-pwa)
- **App publicado**: [Render.com](https://rawrko.onrender.com)
  (site estático, sem build)

## 📁 Estrutura

```
rawrko-pwa/
├── index.html          # página única do app
├── css/style.css       # tema fofo pastel, mobile first
├── js/app.js           # lógica das tarefas
├── js/sw.js            # service worker (offline)
├── manifest.json       # configuração do PWA
├── icons/              # ícones 192/512 + maskable
└── icons/make_icons.py # gerador dos ícones (PIL)
```

---

Feito com 💚 por dinos fofos · RawrKô PWA
