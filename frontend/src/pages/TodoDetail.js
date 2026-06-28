import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getTodo, updateTodo, deleteTodo } from '../api/todos';
import './TodoDetail.css';

const PRIORITIES = ['low', 'medium', 'high'];

function fmt(iso, time = false) {
  if (!iso) return '—';
  const opts = time
    ? { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(iso).toLocaleDateString('en-IN', opts);
}

export default function TodoDetail() {
  const [searchParams] = useSearchParams();
  const id             = searchParams.get('id');
  const navigate       = useNavigate();

  const [todo, setTodo]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({});
  const [saveErr, setSaveErr] = useState('');

  useEffect(() => {
    if (!id) { setError('No task ID provided in URL.'); setLoading(false); return; }
    getTodo(id).then(data => {
      if (data.error) setError(data.error);
      else {
        setTodo(data);
        setForm({ title: data.title, description: data.description, priority: data.priority, dueDate: data.dueDate || '' });
      }
      setLoading(false);
    });
  }, [id]);

  const handleSave = async () => {
    if (!form.title?.trim()) { setSaveErr('Title is required.'); return; }
    const updated = await updateTodo(id, { ...form, dueDate: form.dueDate || null });
    setTodo(updated);
    setEditing(false);
    setSaveErr('');
  };

  const handleToggle = async () => {
    const updated = await updateTodo(id, { completed: !todo.completed });
    setTodo(updated);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task permanently?')) return;
    await deleteTodo(id);
    navigate('/');
  };

  if (loading) return (
    <div className="detail-loading">
      <div className="spinner"></div>
      <p>Loading task...</p>
    </div>
  );

  if (error) return (
    <div>
      <button className="back-btn" onClick={() => navigate('/')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back to Tasks
      </button>
      <div className="detail-error">{error}</div>
    </div>
  );

  const overdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate('/')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back to Tasks
      </button>

      <div className="detail-card">
        {editing ? (
          <div className="detail-edit">
            <h2 className="detail-edit-title">Edit Task</h2>
            {saveErr && <div className="form-error">{saveErr}</div>}
            <div className="form-group">
              <label>Title <span className="required">*</span></label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} autoFocus />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>
            </div>
            <div className="edit-actions">
              <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
              <button className="btn btn-ghost" onClick={() => { setEditing(false); setSaveErr(''); }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="detail-header">
              <div className="detail-title-block">
                <h1 className="detail-title">{todo.title}</h1>
                <div className="detail-pills">
                  <span className={`badge badge-${todo.priority}`}>{todo.priority}</span>
                  <span className={`status-pill ${todo.completed ? 'done' : 'pending'}`}>
                    {todo.completed ? '✓ Completed' : '⏳ Pending'}
                  </span>
                  {overdue && <span className="status-pill overdue">⚠ Overdue</span>}
                </div>
              </div>
              <div className="detail-actions">
                <button className="btn btn-ghost" onClick={handleToggle}>
                  {todo.completed ? '↩ Mark Pending' : '✓ Mark Complete'}
                </button>
                <button className="btn btn-ghost" onClick={() => setEditing(true)}>✏ Edit</button>
                <button className="btn btn-danger" onClick={handleDelete}>🗑 Delete</button>
              </div>
            </div>

            <div className="detail-divider" />

            {/* Description */}
            <div className="detail-section">
              <div className="detail-field-label">Description</div>
              <div className={`detail-field-value ${!todo.description ? 'muted' : ''}`}>
                {todo.description || 'No description provided.'}
              </div>
            </div>

            {/* Meta grid */}
            <div className="detail-grid">
              <div className="detail-field">
                <div className="detail-field-label">Due Date</div>
                <div className="detail-field-value" style={overdue ? { color: 'var(--high)' } : {}}>
                  {fmt(todo.dueDate)}
                </div>
              </div>
              <div className="detail-field">
                <div className="detail-field-label">Priority</div>
                <div className="detail-field-value">
                  <span className={`badge badge-${todo.priority}`}>{todo.priority}</span>
                </div>
              </div>
              <div className="detail-field">
                <div className="detail-field-label">Created</div>
                <div className="detail-field-value">{fmt(todo.createdAt, true)}</div>
              </div>
              <div className="detail-field">
                <div className="detail-field-label">Last Updated</div>
                <div className="detail-field-value">{fmt(todo.updatedAt, true)}</div>
              </div>
            </div>

            <div className="detail-divider" />

            <div className="detail-field">
              <div className="detail-field-label">Task ID</div>
              <div className="detail-id">{todo.id}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
