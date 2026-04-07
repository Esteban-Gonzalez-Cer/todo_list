function addTodo(todos, nextId, title, description, priority = 'Baja') {
    if (!title || !title.trim() || !description || !description.trim()) return null;
 
    const newTodo = {
        id: nextId,
        title: title.trim(),
        description: description.trim(),
        priority,
        completed: false
    };
 
    return {
        todos: [...todos, newTodo],
        nextId: nextId + 1,
        newTodo
    };
}
 
function toggleTodoStatus(todos, id) {
    return todos.map(todo =>
        todo.id === id
            ? { ...todo, completed: !todo.completed }
            : todo
    );
}
 
function removeTodo(todos, id) {
    return todos.filter(todo => todo.id !== id);
}
 
/**
 * Edita los campos de un todo existente.
 * @param {Array}   todos          - array actual de todos
 * @param {number}  id             - id del todo a editar
 * @param {string}  newTitle       - nuevo título (requerido)
 * @param {string}  newDescription - nueva descripción (requerida)
 * @param {boolean} newCompleted   - nuevo estado completed
 * @param {string}  newPriority    - nueva prioridad (opcional)
 * @returns {Array | null} nuevo array con el todo actualizado, o null si hay error
 */
function editTodo(todos, id, newTitle, newDescription, newCompleted, newPriority) {
    if (!newTitle || !newTitle.trim() || !newDescription || !newDescription.trim()) return null;
 
    const exists = todos.some(todo => todo.id === id);
    if (!exists) return null;
 
    return todos.map(todo =>
        todo.id === id
            ? {
                ...todo,
                title: newTitle.trim(),
                description: newDescription.trim(),
                completed: newCompleted,
                priority: newPriority || todo.priority
            }
            : todo
    );
}
 
/**
 * Filtra todos según tipo y palabra clave.
 * @param {Array}  todos      - array de todos a filtrar
 * @param {string} type       - 'all' | 'completed' | 'uncompleted'
 * @param {string} searchWord - palabra a buscar en título o descripción
 * @returns {Array} nuevo array filtrado
 */
function filterTodos(todos, type = 'all', searchWord = '') {
    return todos.filter(todo => {
        if (type === 'completed'   && !todo.completed) return false;
        if (type === 'uncompleted' &&  todo.completed) return false;
 
        if (searchWord.trim() !== '') {
            const word       = searchWord.toLowerCase();
            const titleMatch = todo.title.toLowerCase().includes(word);
            const descMatch  = todo.description.toLowerCase().includes(word);
            if (!titleMatch && !descMatch) return false;
        }
 
        return true;
    });
}
 
/**
 * Parsea datos crudos (de localStorage o de una API) y devuelve { todos, nextId }.
 * Maneja tanto el formato array legacy como el objeto { todos, nextId }.
 * @param {any} data - datos a parsear
 * @returns {{ todos: Array, nextId: number }}
 */
function parseStoredData(data) {
    if (Array.isArray(data)) {
        const maxId = data.reduce((max, t) => t.id > max ? t.id : max, 0);
        return { todos: data, nextId: maxId + 1 };
    }
 
    if (data && typeof data === 'object' && Array.isArray(data.todos)) {
        return {
            todos: data.todos,
            nextId: typeof data.nextId === 'number' ? data.nextId : data.todos.length + 1
        };
    }
 
    return { todos: [], nextId: 1 };
}
 
export { addTodo, toggleTodoStatus, removeTodo, editTodo, filterTodos, parseStoredData };

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { addTodo, toggleTodoStatus, removeTodo, editTodo, filterTodos, parseStoredData };
}