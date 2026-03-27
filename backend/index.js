/* =========================================
   BUSINESS LOGIC (Para Pruebas Unitarias)
   ========================================= */

let todos = [];
let nextId = 1;

function getTodos() {
    return todos;
}

function addTodo(title, description, priority = 'Baja') {
    if (!title || !description) return null;
    const newTodo = {
        id: nextId++,
        title,
        description,
        priority,
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

function editTodo(id, newTitle, newDescription, newCompleted, newPriority) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.title = newTitle;
        todo.description = newDescription;
        todo.completed = newCompleted;
        if (newPriority) todo.priority = newPriority;
    }
    return todo;
}

function restoreData(data) {
    todos = data.todos || [];
    nextId = data.nextId || 1;
}

function getNextId() {
    return nextId;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getTodos, getNextId, addTodo, toggleTodoStatus, removeTodo, editTodo, restoreData };
}

/* =========================================
   DOM LOGIC (Interfaz de Usuario)
   ========================================= */

function saveToLocalStorage() {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('todo_list_data', JSON.stringify({
            todos: getTodos(),
            nextId: getNextId()
        }));
    }
}

function loadFromLocalStorage() {
    if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('todo_list_data');
        if (stored) {
            try {
                restoreData(JSON.parse(stored));
            } catch (e) {
                console.error('Error parsing local storage data', e);
            }
        }
    }
}

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
        
        const modalPriority = document.getElementById('modal-priority');
        if (modalPriority && todo.priority) {
            modalPriority.value = todo.priority;
        } else if (modalPriority) {
            modalPriority.value = 'Baja';
        }

        // Abrir modal
        if (typeof $ !== 'undefined') {
            $('#modal').modal('show');
        }
    }
}

let tableBody = null;
let titleInput = null;
let descriptionInput = null;
let priorityInput = null;
let alertBox = null;
let btn = null;

let modalTitle = null;
let modalDescription = null;
let modalCompleted = null;
let modalPriority = null;
let modalBtn = null;
let modalAlert = null;

if (typeof document !== 'undefined') {
    tableBody = document.querySelector('#table tbody');
    titleInput = document.getElementById('title');
    descriptionInput = document.getElementById('description');
    priorityInput = document.getElementById('priority');
    alertBox = document.getElementById('alert');
    btn = document.getElementById('add');

    modalTitle = document.getElementById('modal-title');
    modalDescription = document.getElementById('modal-description');
    modalCompleted = document.getElementById('modal-completed');
    modalPriority = document.getElementById('modal-priority');
    modalBtn = document.getElementById('modal-btn');
    modalAlert = document.getElementById('modal-alert');
}

function render() {
    if (!tableBody) return;
    saveToLocalStorage();
    tableBody.innerHTML = '';
    
    let currentTodos = getTodos();
    
    // Filtros
    if (typeof document !== 'undefined') {
        const filterForm = document.getElementById('filters');
        if (filterForm) {
            const typeRadios = document.getElementsByName('type');
            let selectedType = 'all';
            for (let radio of typeRadios) {
                if (radio.checked) selectedType = radio.value;
            }
            
            const wordsInput = document.querySelector('input[name="words"]');
            const searchWord = wordsInput ? wordsInput.value.toLowerCase() : '';
            
            currentTodos = currentTodos.filter(todo => {
                if (selectedType === 'completed' && !todo.completed) return false;
                if (selectedType === 'uncompleted' && todo.completed) return false;
                
                if (searchWord !== '') {
                    const titleMatch = todo.title.toLowerCase().includes(searchWord);
                    const descMatch = todo.description.toLowerCase().includes(searchWord);
                    if (!titleMatch && !descMatch) return false;
                }
                return true;
            });
        }
    }

    currentTodos.forEach(todo => {
        const row = document.createElement('tr');
        
        let priorityClass = '';
        if (todo.priority === 'Alta') priorityClass = 'table-danger';
        else if (todo.priority === 'Media') priorityClass = 'table-warning';
        else if (todo.priority === 'Baja') priorityClass = 'table-success';
        
        if (priorityClass) {
            row.classList.add(priorityClass);
        }

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
        
        const prioValue = priorityInput ? priorityInput.value : 'Baja';
        addTodo(titleInput.value.trim(), descriptionInput.value.trim(), prioValue);
        render();

        titleInput.value = '';
        descriptionInput.value = '';
        if (priorityInput) priorityInput.value = 'Baja';
    });
}

if (modalBtn) {
    modalBtn.addEventListener('click', function () {
        if (modalTitle.value.trim() === '' || modalDescription.value.trim() === '') {
            modalAlert.classList.remove('d-none');
            modalAlert.innerText = 'Title and description are required';
            return;
        }

        modalAlert.classList.add('d-none');
        const prioValue = modalPriority ? modalPriority.value : 'Baja';
        editTodo(editingId, modalTitle.value.trim(), modalDescription.value.trim(), modalCompleted.checked, prioValue);
        render();

        if (typeof $ !== 'undefined') {
            $('#modal').modal('hide');
        }
    });
}

// Render inicial
if (typeof document !== 'undefined') {
    const filterForm = document.getElementById('filters');
    if (filterForm) {
        const typeRadios = document.getElementsByName('type');
        for (let radio of typeRadios) {
            radio.addEventListener('change', render);
        }
        
        const wordsInput = document.querySelector('input[name="words"]');
        if (wordsInput) {
            wordsInput.addEventListener('input', render);
        }
        
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            render();
        });
    }

    loadFromLocalStorage();
    render();
}