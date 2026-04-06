function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
 
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
 
 
/* -----------------------------------------
   RENDER
   Recibe el estado, lo filtra con filterTodos()
   y pinta la tabla. No modifica el estado.
----------------------------------------- */
function render() {
    if (!tableBody) return;
 
    // Leer filtros activos del DOM
    const typeRadios = document.getElementsByName('type');
    let selectedType = 'all';
    for (const radio of typeRadios) {
        if (radio.checked) { selectedType = radio.value; break; }
    }
    const wordsInput = document.querySelector('input[name="words"]');
    const searchWord = wordsInput ? wordsInput.value : '';
 
    // filterTodos viene de todos.js
    const visibleTodos = filterTodos(appState.todos, selectedType, searchWord);
 
    tableBody.innerHTML = '';
    visibleTodos.forEach(todo => {
        const row = document.createElement('tr');
 
        // Color de fila según prioridad
        if (todo.priority === 'Alta')  row.classList.add('table-danger');
        if (todo.priority === 'Media') row.classList.add('table-warning');
        if (todo.priority === 'Baja')  row.classList.add('table-success');
 
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
 
 
function handleToggle(id) {
    // toggleTodoStatus viene de todos.js
    appState.todos = toggleTodoStatus(appState.todos, id);
    // saveToLocalStorage viene de storage.js
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
 
    editingId              = id;
    modalTitle.value       = todo.title;
    modalDesc.value        = todo.description;
    modalCompleted.checked = todo.completed;
    modalAlert.classList.add('d-none');
    if (modalPriority) modalPriority.value = todo.priority || 'Baja';
 
    if (typeof $ !== 'undefined') $('#modal').modal('show');
}
 
 
/* -----------------------------------------
   EVENTOS
----------------------------------------- */
 
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
 
        // addTodo viene de todos.js
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
 
    // Enter en el formulario también agrega
    if (addBtn.form) {
        addBtn.form.addEventListener('submit', e => { e.preventDefault(); addBtn.click(); });
    }
}
 
// Botón Guardar del modal (editar)
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
 
        // editTodo viene de todos.js
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
 
// Filtros en la navbar
const filterForm = document.getElementById('filters');
if (filterForm) {
    document.getElementsByName('type').forEach(r => r.addEventListener('change', render));
    const wordsInput = document.querySelector('input[name="words"]');
    if (wordsInput) wordsInput.addEventListener('input', render);
    filterForm.addEventListener('submit', e => e.preventDefault());
}

appState = parseStoredData(loadFromLocalStorage());
render();
 