import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTodos, createTodo, updateTodo, deleteTodo } from '../api/todos';
import './TodoList.css';

const PRIORITIES = ['low', 'medium', 'high'];

/* ── Add Task Modal ── */
function AddModal({ onAdd, onClose }) {
  const [title, setTitle]       = useState('');
  const [desc, setDesc]         = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate]   = useState('');
  const [error, setError]       = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }
    await onAdd({ title: title.trim(), description: desc.trim(), priority, dueDate: dueDate || null });
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">New Task</span>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          {error && <div className="form-error">{error}</div>}
          <div className="form-group">
            <label>Title <span className="required">*</span></label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs to be done?" autoFocus />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Add more context..." rows={3} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Single todo row ── */
function TodoRow({ todo, onToggle, onDelete, onView }) {
  const overdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  return (
    <div className={`todo-row ${todo.completed ? 'completed' : ''}`}>
      <button
        className={`check-btn ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo)}
        title={todo.completed ? 'Mark as pending' : 'Mark as complete'}
      >
        {todo.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div className="todo-row-content" onClick={() => onView(todo.id)}>
        <div className="todo-row-title">{todo.title}</div>
        {todo.description && <div className="todo-row-desc">{todo.description}</div>}
        <div className="todo-row-meta">
          <span className={`badge badge-${todo.priority}`}>{todo.priority}</span>
          {todo.dueDate && (
            <span className={`meta-chip ${overdue ? 'overdue' : ''}`}>
              {overdue ? '⚠ Overdue · ' : '📅 '}
              {new Date(todo.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
          <span className="meta-chip">
            {new Date(todo.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>

      <div className="todo-row-actions">
        <button className="action-btn view-btn" onClick={() => onView(todo.id)}>View →</button>
        <button className="action-btn delete-btn" onClick={() => onDelete(todo.id)}>Delete</button>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function TodoList() {
  const [todos, setTodos]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [prioFilter, setPrio]     = useState('all');
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getAllTodos();
    setTodos(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (data) => {
    await createTodo(data);
    setShowModal(false);
    load();
  };

  const handleToggle = async (todo) => {
    await updateTodo(todo.id, { completed: !todo.completed });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task permanently?')) return;
    await deleteTodo(id);
    load();
  };

  const filtered = todos.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' ? true : statusFilter === 'completed' ? t.completed : !t.completed;
    const matchPrio   = prioFilter   === 'all' ? true : t.priority === prioFilter;
    return matchSearch && matchStatus && matchPrio;
  });

  const pending   = todos.filter(t => !t.completed).length;
  const completed = todos.filter(t => t.completed).length;
  const overdue   = todos.filter(t => t.dueDate && !t.completed && new Date(t.dueDate) < new Date()).length;

  const pendingRows   = filtered.filter(t => !t.completed);
  const completedRows = filtered.filter(t => t.completed);

  return (
    <div className="page">
      {showModal && <AddModal onAdd={handleAdd} onClose={() => setShowModal(false)} />}

      <div className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-sub">Track, prioritize, and complete your work.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Task</button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {[
          { label: 'Total',     value: todos.length, color: 'var(--text)' },
          { label: 'Pending',   value: pending,      color: 'var(--med)' },
          { label: 'Completed', value: completed,    color: 'var(--low)' },
          { label: 'Overdue',   value: overdue,      color: overdue > 0 ? 'var(--high)' : 'var(--text-3)' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </span>
          <input className="search-input" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={statusFilter} onChange={e => setStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select className="filter-select" value={prioFilter} onChange={e => setPrio(e.target.value)}>
          <option value="all">All Priority</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="empty-state">
          <div className="spinner"></div>
          <p className="empty-sub">Loading tasks...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p className="empty-title">{todos.length === 0 ? 'No tasks yet' : 'No results found'}</p>
          <p className="empty-sub">{todos.length === 0 ? 'Click "+ New Task" to get started.' : 'Try adjusting your search or filters.'}</p>
        </div>
      ) : (
        <div className="todo-list">
          {pendingRows.length > 0 && (
            <>
              <div className="list-section-label">Pending · {pendingRows.length}</div>
              {pendingRows.map(t => <TodoRow key={t.id} todo={t} onToggle={handleToggle} onDelete={handleDelete} onView={id => navigate(`/todo?id=${id}`)} />)}
            </>
          )}
          {completedRows.length > 0 && (
            <>
              <div className="list-section-label" style={{ marginTop: pendingRows.length ? 20 : 0 }}>Completed · {completedRows.length}</div>
              {completedRows.map(t => <TodoRow key={t.id} todo={t} onToggle={handleToggle} onDelete={handleDelete} onView={id => navigate(`/todo?id=${id}`)} />)}
            </>
          )}
        </div>
      )}
    </div>
  );
}
