import { useState } from 'react';

const PRIORITY_CLASSES = {
    Alta:  'table-danger',
    Media: 'table-warning',
    Baja:  'table-success',
};

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
    const [busy, setBusy] = useState(false); // previene doble click

    async function handleToggle() {
        if (busy) return;
        setBusy(true);
        try { await onToggle(todo.id); }
        finally { setBusy(false); }
    }

    async function handleDelete() {
        if (busy) return;
        setBusy(true);
        try { await onDelete(todo.id); }
        finally { setBusy(false); }
    }

    const rowClass = PRIORITY_CLASSES[todo.priority] || '';
    const textStyle = todo.completed
        ? { textDecoration: 'line-through', color: 'gray' }
        : {};

    return (
        <tr className={rowClass}>
            <td style={textStyle}>{todo.title}</td>
            <td style={textStyle}>{todo.description}</td>
            <td>
                <span className={`badge bg-${todo.priority === 'Alta' ? 'danger' : todo.priority === 'Media' ? 'warning text-dark' : 'success'}`}>
                    {todo.priority}
                </span>
            </td>
            <td className="text-center">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={handleToggle}
                    disabled={busy}
                />
            </td>
            <td className="text-end">
                <button
                    className="btn btn-primary btn-sm me-1"
                    onClick={() => onEdit(todo)}
                    disabled={busy}
                >
                    ✏️
                </button>
                <button
                    className="btn btn-danger btn-sm"
                    onClick={handleDelete}
                    disabled={busy}
                >
                    🗑️
                </button>
            </td>
        </tr>
    );
}