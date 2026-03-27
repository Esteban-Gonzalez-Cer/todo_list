const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const alertBox = document.getElementById('alert');
const tableBody = document.querySelector('#table tbody');
const btn = document.getElementById('add');

let todos = [];
let nextId = 1;

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        render();
    }
}

function render() {
    tableBody.innerHTML = '';
    todos.forEach(todo => {
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
                <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${todo.id})">
            </td>
            <td class="text-right">
                <button class="btn btn-primary mb-1">
                    <i class="fa fa-pencil"></i>
                </button>
                <button class="btn btn-danger mb-1 ml-1">
                    <i class="fa fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

btn.addEventListener('click', function () {
    if (titleInput.value === '' || descriptionInput.value === '') {
        alertBox.classList.remove('d-none');
        alertBox.innerText = 'Title and description are required';
        return;
    }

    alertBox.classList.add('d-none');

    todos.push({
        id: nextId++,
        title: titleInput.value,
        description: descriptionInput.value,
        completed: false
    });

    render();

    titleInput.value = '';
    descriptionInput.value = '';
});

// Render inicial
render();