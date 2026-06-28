# TaskFlow — Ziptrrip Todo App

A full-stack task management application built with **React** (multi-page) and **Node.js + Express**.

---

## Features & Functionalities

### Page 1 — Task List (`/`)

| Feature | Description |
|---|---|
| Add Task | Inline form with title, description, priority, and due date |
| Toggle Complete | Click checkbox to mark a task done or pending |
| Delete Task | Remove a task with a confirmation prompt |
| View Task | Navigate to the detail page for any task |
| Search | Live filter tasks by title |
| Filter by Status | All / Pending / Completed |
| Filter by Priority | All / Low / Medium / High |
| Stats Bar | Shows total, pending, completed, and overdue counts |
| Overdue Indicator | Tasks past their due date are highlighted in red |
| Grouped List | Tasks are grouped into Pending and Completed sections |

### Page 2 — Task Detail (`/todo?id=<uuid>`)

| Feature | Description |
|---|---|
| View full details | Title, description, priority badge, status pill, due date, timestamps |
| Edit Task | Inline form to modify title, description, priority, due date |
| Toggle Complete | Mark done or revert to pending |
| Delete Task | Permanently remove task and redirect to list |
| Overdue indicator | Red highlight when past due date and not completed |
| Task ID | Displays the unique UUID for reference |

### Backend REST API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/todos` | Retrieve all todos |
| GET | `/api/todos/:id` | Retrieve a single todo by ID |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/:id` | Update a todo (partial or full) |
| DELETE | `/api/todos/:id` | Delete a todo |

All data is persisted in `backend/data/todos.json`.

#### Todo Schema

```json
{
  "id": "uuid-v4",
  "title": "string (required)",
  "description": "string",
  "priority": "low | medium | high",
  "dueDate": "YYYY-MM-DD | null",
  "completed": false,
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6 |
| Backend | Node.js, Express.js |
| Storage | JSON file (`backend/data/todos.json`) |
| Styling | Custom CSS (dark theme) |

---
 Screenshots
  Todo List Page
<img width="1597" height="1087" alt="image" src="https://github.com/user-attachments/assets/1ef8f66a-49e0-4e13-a14e-67264344adce" />
Single Todo Page
<img width="1586" height="1058" alt="image" src="https://github.com/user-attachments/assets/97f864a2-8b3f-4440-a192-1ab4a2049a6c" />
 




## Project Structure

```
ziptrrip-todo/
├── backend/
│   ├── data/todos.json          # Persistent data store
│   ├── helpers/fileStore.js     # Read/write helpers
│   ├── routes/todos.js          # CRUD route handlers
│   ├── index.js                 # Express entry point
│   └── package.json
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── api/todos.js         # Fetch helper functions
│   │   ├── pages/
│   │   │   ├── TodoList.js      # Page 1 — All tasks
│   │   │   └── TodoDetail.js    # Page 2 — Single task (?id=)
│   │   ├── App.js               # Router + sidebar layout
│   │   ├── App.css              # Component styles
│   │   ├── index.css            # Global variables + reset
│   │   └── index.js
│   └── package.json
└── README.md
```

---

## How to Run

### Prerequisites
- Node.js v16+
- npm

### 1. Start the Backend

```bash
cd backend
npm install
npm start
# → Server running on http://localhost:5000
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm start
# → App running on http://localhost:3000
```

Both must run simultaneously. The React app proxies API calls to the backend via `"proxy": "http://localhost:5000"` in `frontend/package.json`.

---

## Assumptions

- Data is stored as a flat JSON file — suitable for a development/demo environment.
- No authentication is implemented; all tasks share a single store.
- Multi-page routing is implemented using React Router v6 with distinct URLs (`/` and `/todo?id=...`) rather than a URL-less SPA.
- Priority is restricted to three values: `low`, `medium`, `high`.
