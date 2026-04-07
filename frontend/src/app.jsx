import { useState, useEffect } from 'react';
import { fetchTodos, createTodo, updateTodo, toggleTodo, deleteTodo } from './services/api';
import { filterTodos } from './todos';
import TodoForm   from './components/TodoForm';
import TodoList   from './components/TodoList';
import EditModal  from './components/EditModal';

export default function App() {
    // --- Estado ---
    const [todos,       setTodos]       = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [apiError,    setApiError]    = useState(null);   // error global de red
    const [filter,      setFilter]      = useState('all');  // 'all' | 'completed' | 'uncompleted'
    const [searchWord,  setSearchWord]  = useState('');
    const [editingTodo, setEditingTodo] = useState(null);   // todo que se está editando

    // --- Cargar todos al montar ---
    useEffect(() => {
        loadTodos();
    }, []);

    async function loadTodos() {
        try {
            setLoading(true);
            setApiError(null);
            const data = await fetchTodos();
            setTodos(data);
        } catch (err) {
            setApiError('No se pudo conectar al servidor. ¿Está corriendo el backend?');
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(formData) {
        // formData ya viene validado por react-hook-form + zod desde TodoForm
        const newTodo = await createTodo(formData);
        setTodos(prev => [...prev, newTodo]);
    }

    async function handleToggle(id) {
        const updated = await toggleTodo(id);
        setTodos(prev => prev.map(t => t.id === id ? updated : t));
    }

    async function handleDelete(id) {
        await deleteTodo(id);
        setTodos(prev => prev.filter(t => t.id !== id));
    }

    async function handleEdit(formData) {
        // formData viene validado desde EditModal
        const updated = await updateTodo(editingTodo.id, formData);
        setTodos(prev => prev.map(t => t.id === editingTodo.id ? updated : t));
        setEditingTodo(null);
    }

    const visibleTodos = filterTodos(todos, filter, searchWord);

    const stats = {
        total:     todos.length,
        completed: todos.filter(t =>  t.completed).length,
        pending:   todos.filter(t => !t.completed).length,
    };

    return (
        <div className="container py-4">
            <h1 className="mb-1">📝 JS Todo List</h1>
            <p className="text-muted mb-4">
                Total: <strong>{stats.total}</strong> &nbsp;·&nbsp;
                Pendientes: <strong>{stats.pending}</strong> &nbsp;·&nbsp;
                Completadas: <strong>{stats.completed}</strong>
            </p>

            {/* Error de red */}
            {apiError && (
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
                    {apiError}
                    <button className="btn btn-sm btn-outline-danger" onClick={loadTodos}>
                        Reintentar
                    </button>
                </div>
            )}

            {/* Formulario agregar */}
            <TodoForm onSubmit={handleCreate} />

            {/* Filtros */}
            <div className="d-flex gap-3 align-items-center my-3 flex-wrap">
                <div>
                    {['all', 'completed', 'uncompleted'].map(f => (
                        <button
                            key={f}
                            className={`btn btn-sm me-1 ${filter === f ? 'btn-info' : 'btn-outline-secondary'}`}
                            onClick={() => setFilter(f)}
                        >
                            {{ all: 'Todas', completed: 'Completadas', uncompleted: 'Pendientes' }[f]}
                        </button>
                    ))}
                </div>
                <input
                    className="form-control form-control-sm"
                    style={{ maxWidth: 200 }}
                    type="search"
                    placeholder="Buscar..."
                    value={searchWord}
                    onChange={e => setSearchWord(e.target.value)}
                />
            </div>

            {/* Lista */}
            {loading ? (
                <p className="text-muted">Cargando tareas...</p>
            ) : (
                <TodoList
                    todos={visibleTodos}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onEdit={setEditingTodo}
                />
            )}

            {/* Modal editar */}
            {editingTodo && (
                <EditModal
                    todo={editingTodo}
                    onSave={handleEdit}
                    onClose={() => setEditingTodo(null)}
                />
            )}
        </div>
    );
}