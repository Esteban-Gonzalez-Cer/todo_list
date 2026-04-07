const express = require('express');
const cors    = require('cors');
const { addTodo, toggleTodoStatus, removeTodo, editTodo } = require('./todos');

const app  = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let state = { todos: [], nextId: 1 };

const VALID_PRIORITIES = ['Alta', 'Media', 'Baja'];

function validateTodoInput({ title, description, priority }) {
    const errors = {};

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        errors.title = 'El título es obligatorio.';
    } else if (title.trim().length < 2) {
        errors.title = 'El título debe tener al menos 2 caracteres.';
    } else if (title.trim().length > 100) {
        errors.title = 'El título no puede superar los 100 caracteres.';
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
        errors.description = 'La descripción es obligatoria.';
    } else if (description.trim().length < 2) {
        errors.description = 'La descripción debe tener al menos 2 caracteres.';
    } else if (description.trim().length > 300) {
        errors.description = 'La descripción no puede superar los 300 caracteres.';
    }

    if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
        errors.priority = `La prioridad debe ser una de: ${VALID_PRIORITIES.join(', ')}.`;
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

function validateId(param) {
    const id = parseInt(param, 10);
    if (isNaN(id) || id <= 0) return null;
    return id;
}

// GET /api/todos — obtener todos
app.get('/api/todos', (req, res) => {
    res.json({ ok: true, data: state.todos });
});

// POST /api/todos — crear todo
app.post('/api/todos', (req, res) => {
    const { title, description, priority = 'Baja' } = req.body;

    const { valid, errors } = validateTodoInput({ title, description, priority });
    if (!valid) {
        return res.status(400).json({ ok: false, errors });
    }

    const result = addTodo(state.todos, state.nextId, title, description, priority);
    state.todos  = result.todos;
    state.nextId = result.nextId;

    res.status(201).json({ ok: true, data: result.newTodo });
});

// PUT /api/todos/:id — editar todo completo
app.put('/api/todos/:id', (req, res) => {
    const id = validateId(req.params.id);
    if (!id) return res.status(400).json({ ok: false, errors: { id: 'ID inválido.' } });

    const { title, description, completed, priority } = req.body;

    const { valid, errors } = validateTodoInput({ title, description, priority });
    if (!valid) return res.status(400).json({ ok: false, errors });

    const updatedTodos = editTodo(state.todos, id, title, description, Boolean(completed), priority);
    if (!updatedTodos) {
        return res.status(404).json({ ok: false, errors: { id: 'Todo no encontrado.' } });
    }

    state.todos = updatedTodos;
    const updated = state.todos.find(t => t.id === id);
    res.json({ ok: true, data: updated });
});

// PATCH /api/todos/:id — toggle completed
app.patch('/api/todos/:id', (req, res) => {
    const id = validateId(req.params.id);
    if (!id) return res.status(400).json({ ok: false, errors: { id: 'ID inválido.' } });

    const exists = state.todos.some(t => t.id === id);
    if (!exists) return res.status(404).json({ ok: false, errors: { id: 'Todo no encontrado.' } });

    state.todos = toggleTodoStatus(state.todos, id);
    const updated = state.todos.find(t => t.id === id);
    res.json({ ok: true, data: updated });
});

// DELETE /api/todos/:id — eliminar todo
app.delete('/api/todos/:id', (req, res) => {
    const id = validateId(req.params.id);
    if (!id) return res.status(400).json({ ok: false, errors: { id: 'ID inválido.' } });

    const exists = state.todos.some(t => t.id === id);
    if (!exists) return res.status(404).json({ ok: false, errors: { id: 'Todo no encontrado.' } });

    state.todos = removeTodo(state.todos, id);
    res.json({ ok: true, data: { id } });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});