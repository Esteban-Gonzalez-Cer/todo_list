const BASE_URL = 'http://localhost:3000/api';

// Helper interno: hace fetch y lanza error si la respuesta no es ok
async function request(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    const json = await res.json();

    if (!res.ok) {
        // Lanza un error con los errores de validación del servidor
        const err = new Error('API Error');
        err.errors = json.errors || { general: 'Error inesperado del servidor.' };
        err.status = res.status;
        throw err;
    }

    return json.data;
}

// GET /api/todos
export async function fetchTodos() {
    return request('/todos');
}

// POST /api/todos
export async function createTodo({ title, description, priority }) {
    return request('/todos', {
        method: 'POST',
        body: JSON.stringify({ title, description, priority }),
    });
}

// PUT /api/todos/:id
export async function updateTodo(id, { title, description, completed, priority }) {
    return request(`/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, description, completed, priority }),
    });
}

// PATCH /api/todos/:id — toggle completed
export async function toggleTodo(id) {
    return request(`/todos/${id}`, { method: 'PATCH' });
}

// DELETE /api/todos/:id
export async function deleteTodo(id) {
    return request(`/todos/${id}`, { method: 'DELETE' });
}