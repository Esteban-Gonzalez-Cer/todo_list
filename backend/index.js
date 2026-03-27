const btn = document.getElementById('add');
const title = document.getElementById('title');
const description = document.getElementById('description');
const alertBox = document.getElementById('alert');
const tableBody = document.querySelector('#table tbody');

btn.addEventListener('click', function () {
    if (title.value === '' || description.value === '') {
        alertBox.classList.remove('d-none');
        alertBox.innerText = 'Title and description are required';
        return;
    }

    alertBox.classList.add('d-none');

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            ${title.value}
        </td>
        <td>
            ${description.value}
        </td>
        <td class="text-center">
            <input type="checkbox">
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

    title.value = '';
    description.value = '';
});