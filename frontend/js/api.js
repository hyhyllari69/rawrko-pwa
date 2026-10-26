/* ============================================================
   RawrKô — Cliente da API (frontend) 🦕
   Conversa com o backend; se a API estiver fora do ar
   (ou sem internet), o app usa o localStorage local.
   ============================================================ */
'use strict';

/* ⚙️ URL do backend publicado no Render (Web Service).
   Troque aqui se o endereço da sua API for diferente. */
const RAWRKO_API_URL = 'https://rawrko-api.onrender.com';

const REQUEST_TIMEOUT = 8000; // ms

async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const res = await fetch(RAWRKO_API_URL + path, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null; // API inacessível → o app segue em modo offline
  } finally {
    clearTimeout(timer);
  }
}

window.RawrAPI = {
  /** Busca todas as tarefas no servidor. null = offline. */
  getTasks() {
    return request('/tasks');
  },

  /** Cria a tarefa no servidor. null = offline. */
  createTask(task) {
    return request('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  },

  /** Atualiza a tarefa no servidor. null = offline. */
  updateTask(task) {
    return request(`/tasks/${task.id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  },

  /** Remove a tarefa no servidor. null = offline. */
  deleteTask(id) {
    return request(`/tasks/${id}`, { method: 'DELETE' });
  },
};
