/* ============================================================
   RawrKô — API REST de tarefas 🦕
   Backend Node.js + Express, persistência em arquivo JSON
   ============================================================ */
'use strict';

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'tasks.json');

const app = express();
app.use(cors());
app.use(express.json({ limit: '256kb' }));

/* ---------- Persistência (arquivo JSON) ---------- */
function readTasks() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeTasks(tasks) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

/* ---------- Rotas ---------- */
app.get('/health', (_req, res) => {
  res.json({ ok: true, name: 'RawrKô API', rawr: '🦕' });
});

// Lista todas as tarefas
app.get('/tasks', (_req, res) => {
  res.json(readTasks());
});

// Cria uma tarefa
app.post('/tasks', (req, res) => {
  const { text, cat = 'estudo', prio = 'media', date = '' } = req.body ?? {};
  if (!text || !String(text).trim()) {
    return res.status(400).json({ error: 'O campo "text" é obrigatório.' });
  }
  const tasks = readTasks();
  const task = {
    id: req.body.id || Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    text: String(text).trim().slice(0, 120),
    done: false,
    cat,
    prio,
    date,
    created: Date.now(),
  };
  tasks.unshift(task);
  writeTasks(tasks);
  res.status(201).json(task);
});

// Atualiza uma tarefa (concluir, editar, etc.)
app.put('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const i = tasks.findIndex((t) => t.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Tarefa não encontrada.' });

  const allowed = ['text', 'done', 'cat', 'prio', 'date'];
  for (const key of allowed) {
    if (key in req.body) tasks[i][key] = req.body[key];
  }
  writeTasks(tasks);
  res.json(tasks[i]);
});

// Remove uma tarefa
app.delete('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const i = tasks.findIndex((t) => t.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Tarefa não encontrada.' });
  const [removed] = tasks.splice(i, 1);
  writeTasks(tasks);
  res.json(removed);
});

app.listen(PORT, () => {
  console.log(`🦕 RawrKô API rodando na porta ${PORT}`);
});
