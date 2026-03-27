const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const alertBox = document.getElementById('alert');
const tableBody = document.querySelector('#table tbody');
const btn = document.getElementById('add');

let todos = [];
let nextId = 1;

function render() {
    tableBody.innerHTML = '';
    todos.forEach(todo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                ${todo.title}
            </td>
            <td>
                ${todo.description}
            </td>
            <td class="text-center">
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
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