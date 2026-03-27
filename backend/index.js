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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getTodos, addTodo, toggleTodoStatus, removeTodo };
}

function handleToggle(id) {
    toggleTodoStatus(id);
    render();
}

function handleDelete(id) {
    removeTodo(id);
    render();
}

let tableBody = null;
let titleInput = null;
let descriptionInput = null;
let alertBox = null;
let btn = null;

if (typeof document !== 'undefined') {
    tableBody = document.querySelector('#table tbody');
    titleInput = document.getElementById('title');
    descriptionInput = document.getElementById('description');
    alertBox = document.getElementById('alert');
    btn = document.getElementById('add');
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
                <button class="btn btn-primary mb-1">
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
        if (titleInput.value === '' || descriptionInput.value === '') {
            alertBox.classList.remove('d-none');
            alertBox.innerText = 'Title and description are required';
            return;
        }

        alertBox.classList.add('d-none');
        
        addTodo(titleInput.value, descriptionInput.value);
        render();

        titleInput.value = '';
        descriptionInput.value = '';
    });
}


// Render inicial
if (typeof document !== 'undefined') {
    render();
}