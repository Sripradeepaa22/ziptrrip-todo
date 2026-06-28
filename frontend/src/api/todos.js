const BASE = '/api/todos';

export const getAllTodos = () => fetch(BASE).then(r => r.json());
export const getTodo    = (id) => fetch(`${BASE}/${id}`).then(r => r.json());

export const createTodo = (data) =>
  fetch(BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());

export const updateTodo = (id, data) =>
  fetch(`${BASE}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());

export const deleteTodo = (id) =>
  fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(r => r.json());
