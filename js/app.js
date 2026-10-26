/* ============================================================
   RawrKô — Suas tarefas na era dos dinos 🦕
   Lógica do aplicativo (vanilla JS, sem dependências)
   ============================================================ */
'use strict';

/* ---------- Estado ---------- */
const STORAGE_KEY = 'rawrko.tasks.v1';

let tasks = load();
let filter = 'all';        // all | pend | done
let catFilter = 'all';     // all | estudo | casa | lazer | importante
let query = '';
let sortBy = 'created';
let lastDeleted = null;    // { task, index }
let undoTimer = null;

const CAT_META = {
  estudo:      { emoji: '🦕', label: 'Estudo' },
  casa:        { emoji: '🥚', label: 'Casa' },
  lazer:       { emoji: '🍃', label: 'Lazer' },
  importante:  { emoji: '⭐', label: 'Importante' },
};
const PRIO_LABEL = { alta: '🔴 Alta', media: '🟡 Média', baixa: '🟢 Baixa' };
const PRIO_ORDER = { alta: 0, media: 1, baixa: 2 };

/* ---------- Persistência ---------- */
function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/* ---------- Helpers ---------- */
const $ = (sel) => document.querySelector(sel);

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fmtDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

/* ---------- Elementos ---------- */
const listEl      = $('#taskList');
const emptyEl     = $('#emptyState');
const formEl      = $('#formTask');
const inputTask   = $('#inputTask');
const inputDate   = $('#inputDate');
const selectCat   = $('#selectCat');
const selectPrio  = $('#selectPrio');
const selectSort  = $('#selectSort');
const inputSearch = $('#inputSearch');
const toastEl     = $('#toast');
const btnUndo     = $('#btnUndo');
const confettiEl  = $('#confetti');
const dinoEl      = $('#dinoMascot');
const dinoSayEl   = $('#dinoSay');
const btnInstall  = $('#btnInstall');

/* ---------- Toast ---------- */
let toastTimer = null;
function toast(msg, ms = 2200) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
}

/* ---------- Mascote ---------- */
function setDino(mood, say) {
  dinoEl.classList.remove('happy', 'party', 'sleep');
  if (mood) dinoEl.classList.add(mood);
  if (say) dinoSayEl.textContent = say;
}

function dinoMoodByProgress(done, total) {
  if (total === 0) {
    setDino('sleep', 'Zzz... sem tarefas. Que paz! 😴💤');
  } else if (done === total) {
    setDino('party', 'RAWR! Você zerou tudo! 🎉🦖');
  } else if (done > 0) {
    setDino('happy', 'Mmmm... indo bem! Continue! 💪🦕');
  } else {
    setDino(null, 'Eee! Quantas coisas pra fazer? 🥚');
  }
}

/* ---------- Confete ---------- */
function confetti() {
  const colors = ['#7FC8A9', '#F58FB0', '#FFF3B0', '#C9B6E4', '#A8E6CF'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = 1.6 + Math.random() * 1.6 + 's';
    p.style.animationDelay = Math.random() * .5 + 's';
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiEl.appendChild(p);
    setTimeout(() => p.remove(), 3800);
  }
}

/* ---------- CRUD ---------- */
function addTask(text, cat, prio, date) {
  tasks.unshift({
    id: uid(),
    text: text.trim(),
    done: false,
    cat,
    prio,
    date,                    // '' se não tiver prazo
    created: Date.now(),
  });
  save();
  render();
  toast('Rawr! Tarefa salva! 🦕');
}

function toggleTask(id) {
  const t = tasks.find((t) => t.id === id);
  if (!t) return;
  t.done = !t.done;
  save();
  render();
  if (t.done) {
    const done = tasks.filter((x) => x.done).length;
    if (done === tasks.length) {
      confetti();
      toast('Rawrrr! Todas as tarefas concluídas! 🎉🦖');
    } else {
      toast('Muito bem! +1 pro dino 💚');
    }
  }
}

function deleteTask(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return;
  lastDeleted = { task: tasks[index], index };
  tasks.splice(index, 1);
  save();
  render();
  toast('Ops! Tarefa virou fóssil 🦴');
  btnUndo.classList.remove('hidden');
  clearTimeout(undoTimer);
  undoTimer = setTimeout(() => btnUndo.classList.add('hidden'), 6000);
}

function undoDelete() {
  if (!lastDeleted) return;
  tasks.splice(lastDeleted.index, 0, lastDeleted.task);
  lastDeleted = null;
  save();
  render();
  btnUndo.classList.add('hidden');
  clearTimeout(undoTimer);
  toast('Mago! Tarefa de volta 🪄🦕');
}

function editTask(id, newText) {
  const t = tasks.find((t) => t.id === id);
  if (!t) return;
  const text = newText.trim();
  if (text) {
    t.text = text;
    save();
    toast('Rawr! Tarefa atualizada ✏️');
  }
  render();
}

function clearDone() {
  if (!tasks.some((t) => t.done)) {
    toast('Nenhuma tarefa feita ainda 🤔');
    return;
  }
  tasks = tasks.filter((t) => !t.done);
  save();
  render();
  toast('Fósseis limpos! 🧹✨');
}

/* ---------- Render ---------- */
function visibleTasks() {
  let out = tasks.filter((t) => {
    if (filter === 'pend' && t.done) return false;
    if (filter === 'done' && !t.done) return false;
    if (catFilter !== 'all' && t.cat !== catFilter) return false;
    if (query && !t.text.toLowerCase().includes(query)) return false;
    return true;
  });

  if (sortBy === 'prio') {
    out.sort((a, b) => PRIO_ORDER[a.prio] - PRIO_ORDER[b.prio] || b.created - a.created);
  } else if (sortBy === 'date') {
    out.sort((a, b) => (a.date || '9999') < (b.date || '9999') ? -1 : 1);
  } else {
    out.sort((a, b) => b.created - a.created);
  }
  return out;
}

function render() {
  const visible = visibleTasks();
  listEl.innerHTML = '';

  visible.forEach((t) => {
    const li = document.createElement('li');
    li.className = 'task' + (t.done ? ' done' : '');
    li.dataset.prio = t.prio;
    li.dataset.id = t.id;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-toggle';
    btn.setAttribute('aria-label', t.done ? 'Desmarcar tarefa' : 'Concluir tarefa');
    btn.textContent = t.done ? '💖' : '🦴';

    const body = document.createElement('div');
    body.className = 'task-body';

    const title = document.createElement('p');
    title.className = 'task-title';
    title.textContent = t.text;

    const meta = document.createElement('div');
    meta.className = 'task-meta';
    const cat = CAT_META[t.cat] ?? CAT_META.estudo;
    meta.innerHTML = `<span>${cat.emoji} ${cat.label}</span><span>${PRIO_LABEL[t.prio]}</span>`;
    if (t.date) {
      const late = !t.done && t.date < todayISO();
      const d = document.createElement('span');
      if (late) d.className = 'late';
      d.textContent = `${late ? '⚠️ atrasada' : '📅'} ${fmtDate(t.date)}`;
      meta.appendChild(d);
    }

    body.append(title, meta);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'btn-edit';
    edit.setAttribute('aria-label', 'Editar tarefa');
    edit.textContent = '✏️';
    edit.addEventListener('click', () => startEdit(li, t.id));

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'btn-del';
    del.setAttribute('aria-label', 'Excluir tarefa');
    del.textContent = '🗑️';
    del.addEventListener('click', () => deleteTask(t.id));

    actions.append(edit, del);
    btn.addEventListener('click', () => toggleTask(t.id));
    li.append(btn, body, actions);
    listEl.appendChild(li);
  });

  // estado vazio
  const emptyMsgs = {
    noTasks: '🥚 Nenhuma tarefa por aqui!\nQue tal chocar uma nova? 🐣',
    noResults: '🔍 Nada encontrado...\nEsse ovo não chocou! 🥚',
    allDone: '🎉 Tudo feito! O dino está orgulhoso!\nRawrrr! 💚',
  };
  if (visible.length === 0) {
    emptyEl.classList.remove('hidden');
    emptyEl.textContent = query || catFilter !== 'all'
      ? emptyMsgs.noResults
      : tasks.length === 0
        ? emptyMsgs.noTasks
        : emptyMsgs.allDone;
  } else {
    emptyEl.classList.add('hidden');
  }

  // progresso
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  $('#progressLabel').textContent = `${done} de ${total} feitas`;
  $('#progressPct').textContent = `${pct}%`;
  const bar = $('#progressBar');
  bar.style.width = pct + '%';
  bar.classList.toggle('full', pct === 100 && total > 0);

  dinoMoodByProgress(done, total);
}

/* ---------- Edição inline ---------- */
function startEdit(li, id) {
  const t = tasks.find((t) => t.id === id);
  const titleEl = li.querySelector('.task-title');
  const input = document.createElement('input');
  input.className = 'editing';
  input.type = 'text';
  input.maxLength = 120;
  input.value = t.text;
  titleEl.replaceWith(input);
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);

  let closed = false;
  const commit = () => {
    if (closed) return;
    closed = true;
    editTask(id, input.value);
  };
  input.addEventListener('blur', commit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') input.blur();
    if (e.key === 'Escape') { closed = true; render(); }
  });
}

/* ---------- Eventos ---------- */
formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = inputTask.value.trim();
  if (!text) return;
  addTask(text, selectCat.value, selectPrio.value, inputDate.value);
  inputTask.value = '';
  inputDate.value = '';
  inputTask.focus();
});

inputSearch.addEventListener('input', () => {
  query = inputSearch.value.trim().toLowerCase();
  render();
});

document.querySelectorAll('.filters .chip:not(.cat)').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filters .chip:not(.cat)').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    filter = chip.dataset.filter;
    render();
  });
});

document.querySelectorAll('#catFilters .chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#catFilters .chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    catFilter = chip.dataset.cat;
    render();
  });
});

selectSort.addEventListener('change', () => {
  sortBy = selectSort.value;
  render();
});

$('#btnClearDone').addEventListener('click', clearDone);
btnUndo.addEventListener('click', undoDelete);

/* ---------- Instalação PWA ---------- */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  btnInstall.classList.remove('hidden');
});
btnInstall.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  btnInstall.classList.add('hidden');
});
window.addEventListener('appinstalled', () => {
  btnInstall.classList.add('hidden');
  toast('RawrKô instalado! 📱🦕');
});

/* ---------- Start ---------- */
render();
