import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onDelete, onEdit }) {
    if (todos.length === 0) {
        return (
            <p className="text-muted text-center py-4">
                No hay tareas para mostrar.
            </p>
        );
    }

    return (
        <table className="table table-striped mt-2">
            <thead>
                <tr>
                    <th>Tarea</th>
                    <th>Descripción</th>
                    <th>Prioridad</th>
                    <th className="text-center">Completada</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {todos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={onToggle}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                ))}
            </tbody>
        </table>
    );
}