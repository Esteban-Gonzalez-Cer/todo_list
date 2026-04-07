import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editTodoSchema, PRIORITIES } from '../validations';
import { useState } from 'react';

export default function EditModal({ todo, onSave, onClose }) {
    const [apiErrors,  setApiErrors]  = useState({});
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(editTodoSchema),
        defaultValues: {
            title:       todo.title,
            description: todo.description,
            priority:    todo.priority,
            completed:   todo.completed,
        },
    });

    async function submit(data) {
        try {
            setSubmitting(true);
            setApiErrors({});
            await onSave(data);
        } catch (err) {
            if (err.errors) setApiErrors(err.errors);
        } finally {
            setSubmitting(false);
        }
    }

    function getError(field) {
        return errors[field]?.message || apiErrors[field];
    }

    return (
        // Overlay
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">Editar Tarea</h5>
                        <button className="btn-close" onClick={onClose} />
                    </div>

                    <form onSubmit={handleSubmit(submit)} noValidate>
                        <div className="modal-body">

                            {apiErrors.general && (
                                <div className="alert alert-danger py-2">{apiErrors.general}</div>
                            )}

                            {/* Título */}
                            <div className="mb-3">
                                <label className="form-label">Título</label>
                                <input
                                    className={`form-control ${getError('title') ? 'is-invalid' : ''}`}
                                    {...register('title')}
                                />
                                {getError('title') && (
                                    <div className="invalid-feedback">{getError('title')}</div>
                                )}
                            </div>

                            {/* Descripción */}
                            <div className="mb-3">
                                <label className="form-label">Descripción</label>
                                <textarea
                                    className={`form-control ${getError('description') ? 'is-invalid' : ''}`}
                                    rows={3}
                                    {...register('description')}
                                />
                                {getError('description') && (
                                    <div className="invalid-feedback">{getError('description')}</div>
                                )}
                            </div>

                            {/* Prioridad */}
                            <div className="mb-3">
                                <label className="form-label">Prioridad</label>
                                <select
                                    className={`form-select ${getError('priority') ? 'is-invalid' : ''}`}
                                    {...register('priority')}
                                >
                                    {PRIORITIES.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                                {getError('priority') && (
                                    <div className="invalid-feedback">{getError('priority')}</div>
                                )}
                            </div>

                            {/* Completada */}
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="modal-completed"
                                    {...register('completed')}
                                />
                                <label className="form-check-label" htmlFor="modal-completed">
                                    Marcar como completada
                                </label>
                            </div>

                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={submitting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-info"
                                disabled={submitting}
                            >
                                {submitting ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}