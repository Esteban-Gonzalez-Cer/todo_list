/**
 * Crea un nuevo todo y devuelve el estado actualizado.
 * @returns {{ todos: Array, nextId: number, newTodo: Object } | null}
 */
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
 
/**
 * Alterna el estado completed de un todo.
 * @returns {Array} nuevo array con el todo actualizado
 */
function toggleTodoStatus(todos, id) {
    return todos.map(todo =>
        todo.id === id
            ? { ...todo, completed: !todo.completed }
            : todo
    );
}
 
/**
 * Elimina un todo por id.
 * @returns {Array} nuevo array sin el todo eliminado
 */
function removeTodo(todos, id) {
    return todos.filter(todo => todo.id !== id);
}
 
/**
 * Edita los campos de un todo existente.
 * @returns {Array | null} nuevo array con el todo actualizado, o null si no existe o hay error
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
 * Filtra todos según tipo (all | completed | uncompleted) y palabra clave.
 * @returns {Array} nuevo array filtrado
 */
function filterTodos(todos, type = 'all', searchWord = '') {
    return todos.filter(todo => {
        if (type === 'completed' && !todo.completed) return false;
        if (type === 'uncompleted' && todo.completed) return false;
 
        if (searchWord.trim() !== '') {
            const word = searchWord.toLowerCase();
            const titleMatch = todo.title.toLowerCase().includes(word);
            const descMatch  = todo.description.toLowerCase().includes(word);
            if (!titleMatch && !descMatch) return false;
        }
 
        return true;
    });
}
 
/**
 * Parsea datos guardados (localStorage o API) y devuelve { todos, nextId }.
 * Maneja tanto el formato array legacy como el objeto { todos, nextId }.
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
 
// Exporta solo las funciones de negocio para pruebas unitarias
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { addTodo, toggleTodoStatus, removeTodo, editTodo, filterTodos, parseStoredData };
}
 
function saveToLocalStorage(state) {
    try {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem('todo_list_data', JSON.stringify(state));
    } catch (e) {
        console.error('Error al guardar en localStorage', e);
    }
}
 
function loadFromLocalStorage() {
    try {
        if (typeof localStorage === 'undefined') return null;
        const stored = localStorage.getItem('todo_list_data');
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        console.error('Error al leer localStorage', e);
        return null;
    }
}
 
// Ayudante para evitar XSS al insertar texto en innerHTML
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
 
if (typeof document !== 'undefined') {
    // --- Estado de la app ---
    let appState = { todos: [], nextId: 1 };
    let editingId = null;
 
    // --- Referencias al DOM ---
    const tableBody      = document.querySelector('#table tbody');
    const titleInput     = document.getElementById('title');
    const descInput      = document.getElementById('description');
    const priorityInput  = document.getElementById('priority');
    const alertBox       = document.getElementById('alert');
    const addBtn         = document.getElementById('add');
 
    const modalTitle     = document.getElementById('modal-title');
    const modalDesc      = document.getElementById('modal-description');
    const modalCompleted = document.getElementById('modal-completed');
    const modalPriority  = document.getElementById('modal-priority');
    const modalBtn       = document.getElementById('modal-btn');
    const modalAlert     = document.getElementById('modal-alert');
 
    // --- Render ---
    function render() {
        if (!tableBody) return;
 
        // Leer filtros activos
        const typeRadios = document.getElementsByName('type');
        let selectedType = 'all';
        for (const radio of typeRadios) {
            if (radio.checked) { selectedType = radio.value; break; }
        }
        const wordsInput = document.querySelector('input[name="words"]');
        const searchWord = wordsInput ? wordsInput.value : '';
 
        // Usar función pura para filtrar
        const visibleTodos = filterTodos(appState.todos, selectedType, searchWord);
 
        tableBody.innerHTML = '';
        visibleTodos.forEach(todo => {
            const row = document.createElement('tr');
 
            let priorityClass = '';
            if (todo.priority === 'Alta')  priorityClass = 'table-danger';
            if (todo.priority === 'Media') priorityClass = 'table-warning';
            if (todo.priority === 'Baja')  priorityClass = 'table-success';
            if (priorityClass) row.classList.add(priorityClass);
 
            const textStyle = todo.completed ? 'text-decoration: line-through; color: gray;' : '';
            row.innerHTML = `
                <td style="${textStyle}">${escapeHtml(todo.title)}</td>
                <td style="${textStyle}">${escapeHtml(todo.description)}</td>
                <td class="text-center">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="handleToggle(${todo.id})">
                </td>
                <td class="text-right">
                    <button class="btn btn-primary mb-1" onclick="handleEdit(${todo.id})">
                        <i class="fa fa-pencil"></i>
                    </button>
                    <button class="btn btn-danger mb-1 ml-1" onclick="handleDelete(${todo.id})">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
 
    // --- Handlers (conectan UI con funciones puras) ---
    function handleToggle(id) {
        appState.todos = toggleTodoStatus(appState.todos, id);
        saveToLocalStorage(appState);
        render();
    }
 
    function handleDelete(id) {
        appState.todos = removeTodo(appState.todos, id);
        saveToLocalStorage(appState);
        render();
    }
 
    function handleEdit(id) {
        const todo = appState.todos.find(t => t.id === id);
        if (!todo) return;
 
        editingId = id;
        modalTitle.value       = todo.title;
        modalDesc.value        = todo.description;
        modalCompleted.checked = todo.completed;
        modalAlert.classList.add('d-none');
        if (modalPriority) modalPriority.value = todo.priority || 'Baja';
 
        if (typeof $ !== 'undefined') $('#modal').modal('show');
    }
 
    // Botón Agregar
    if (addBtn) {
        addBtn.addEventListener('click', function () {
            const title    = titleInput.value.trim();
            const desc     = descInput.value.trim();
            const priority = priorityInput ? priorityInput.value : 'Baja';
 
            if (!title || !desc) {
                alertBox.classList.remove('d-none');
                alertBox.innerText = 'Title and description are required';
                return;
            }
 
            const result = addTodo(appState.todos, appState.nextId, title, desc, priority);
            if (result) {
                appState.todos  = result.todos;
                appState.nextId = result.nextId;
                saveToLocalStorage(appState);
                render();
            }
 
            alertBox.classList.add('d-none');
            titleInput.value = '';
            descInput.value  = '';
            if (priorityInput) priorityInput.value = 'Baja';
        });
 
        if (addBtn.form) {
            addBtn.form.addEventListener('submit', e => { e.preventDefault(); addBtn.click(); });
        }
    }
 
    // Botón Guardar del modal
    if (modalBtn) {
        modalBtn.addEventListener('click', function () {
            const title    = modalTitle.value.trim();
            const desc     = modalDesc.value.trim();
            const priority = modalPriority ? modalPriority.value : 'Baja';
 
            if (!title || !desc) {
                modalAlert.classList.remove('d-none');
                modalAlert.innerText = 'Title and description are required';
                return;
            }
 
            const updatedTodos = editTodo(appState.todos, editingId, title, desc, modalCompleted.checked, priority);
            if (updatedTodos) {
                appState.todos = updatedTodos;
                saveToLocalStorage(appState);
                render();
            }
 
            modalAlert.classList.add('d-none');
            if (typeof $ !== 'undefined') $('#modal').modal('hide');
        });
    }
 
    // Filtros
    const filterForm = document.getElementById('filters');
    if (filterForm) {
        document.getElementsByName('type').forEach(r => r.addEventListener('change', render));
        const wordsInput = document.querySelector('input[name="words"]');
        if (wordsInput) wordsInput.addEventListener('input', render);
        filterForm.addEventListener('submit', e => e.preventDefault());
    }
 
    // --- Init ---
    appState = parseStoredData(loadFromLocalStorage());
    render();
}
 