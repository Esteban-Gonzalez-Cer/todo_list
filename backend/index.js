/* =========================================
   BUSINESS LOGIC (Para Pruebas Unitarias)
   ========================================= */

let todos = [];
let nextId = 1;

function getTodos() {
    return todos;
}

function addTodo(title, description) {
    if (!title || !description) return null;
    const newTodo = {
        id: nextId++,
        title,
        description,
        completed: false
    };
    todos.push(newTodo);
    return newTodo;
}

function toggleTodoStatus(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
    }
    return todo;
}

function removeTodo(id) {
    todos = todos.filter(t => t.id !== id);
}

function editTodo(id, newTitle, newDescription, newCompleted) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.title = newTitle;
        todo.description = newDescription;
        todo.completed = newCompleted;
    }
    return todo;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getTodos, addTodo, toggleTodoStatus, removeTodo, editTodo };
}

/* =========================================
   DOM LOGIC (Interfaz de Usuario)
   ========================================= */

function handleToggle(id) {
    toggleTodoStatus(id);
    render();
}

function handleDelete(id) {
    removeTodo(id);
    render();
}

let editingId = null;

function handleEdit(id) {
    const todo = getTodos().find(t => t.id === id);
    if (!todo) return;
    
    editingId = id;
    if (typeof document !== 'undefined') {
        document.getElementById('modal-title').value = todo.title;
        document.getElementById('modal-description').value = todo.description;
        document.getElementById('modal-completed').checked = todo.completed;
        document.getElementById('modal-alert').classList.add('d-none');
        
        // Abrir modal
        if (typeof $ !== 'undefined') {
            $('#modal').modal('show');
        }
    }
}

let tableBody = null;
let titleInput = null;
let descriptionInput = null;
let alertBox = null;
let btn = null;

let modalTitle = null;
let modalDescription = null;
let modalCompleted = null;
let modalBtn = null;
let modalAlert = null;

if (typeof document !== 'undefined') {
    tableBody = document.querySelector('#table tbody');
    titleInput = document.getElementById('title');
    descriptionInput = document.getElementById('description');
    alertBox = document.getElementById('alert');
    btn = document.getElementById('add');
    
    modalTitle = document.getElementById('modal-title');
    modalDescription = document.getElementById('modal-description');
    modalCompleted = document.getElementById('modal-completed');
    modalBtn = document.getElementById('modal-btn');
    modalAlert = document.getElementById('modal-alert');
}

function render() {
    if (!tableBody) return;
    tableBody.innerHTML = '';
    const currentTodos = getTodos();
    currentTodos.forEach(todo => {
        const row = document.createElement('tr');
        const textStyle = todo.completed ? 'text-decoration: line-through; color: gray;' : '';
        row.innerHTML = `
            <td style="${textStyle}">
                ${todo.title}
            </td>
            <td style="${textStyle}">
                ${todo.description}
            </td>
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

if (btn) {
    btn.addEventListener('click', function () {
        if (titleInput.value.trim() === '' || descriptionInput.value.trim() === '') {
            alertBox.classList.remove('d-none');
            alertBox.innerText = 'Title and description are required';
            return;
        }

        alertBox.classList.add('d-none');
        
        addTodo(titleInput.value.trim(), descriptionInput.value.trim());
        render();

        titleInput.value = '';
        descriptionInput.value = '';
    });
}

if (modalBtn) {
    modalBtn.addEventListener('click', function() {
        if (modalTitle.value.trim() === '' || modalDescription.value.trim() === '') {
            modalAlert.classList.remove('d-none');
            modalAlert.innerText = 'Title and description are required';
            return;
        }
        
        modalAlert.classList.add('d-none');
        
        editTodo(editingId, modalTitle.value.trim(), modalDescription.value.trim(), modalCompleted.checked);
        render();
        
        if (typeof $ !== 'undefined') {
            $('#modal').modal('hide');
        }
    });
}

// Render inicial
if (typeof document !== 'undefined') {
    render();
}