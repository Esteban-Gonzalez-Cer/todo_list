import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoSchema, PRIORITIES } from '../validations';
import { useState } from 'react';

export default function TodoForm({ onSubmit }) {
    const [apiErrors, setApiErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(todoSchema),
        defaultValues: { priority: 'Baja' },
    });

    async function submit(data) {
        try {
            setSubmitting(true);
            setApiErrors({});
            await onSubmit(data);
            reset();
        } catch (err) {
            // Errores de validación del servidor (segunda línea de defensa)
            if (err.errors) setApiErrors(err.errors);
        } finally {
            setSubmitting(false);
        }
    }

    // Combina errores de zod con errores del servidor
    function getError(field) {
        return errors[field]?.message || apiErrors[field];
    }

    return (
        <form onSubmit={handleSubmit(submit)} noValidate>
            <div className="row g-2 align-items-start">

                {/* Título */}
                <div className="col-sm-3">
                    <label className="form-label">Título</label>
                    <input
                        className={`form-control ${getError('title') ? 'is-invalid' : ''}`}
                        placeholder="Aprender React..."
                        {...register('title')}
                    />
                    {getError('title') && (
                        <div className="invalid-feedback">{getError('title')}</div>
                    )}
                </div>

                {/* Descripción */}
                <div className="col-sm-5">
                    <label className="form-label">Descripción</label>
                    <input
                        className={`form-control ${getError('description') ? 'is-invalid' : ''}`}
                        placeholder="Ver la documentación oficial..."
                        {...register('description')}
                    />
                    {getError('description') && (
                        <div className="invalid-feedback">{getError('description')}</div>
                    )}
                </div>

                {/* Prioridad */}
                <div className="col-sm-2">
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

                {/* Botón */}
                <div className="col-sm-2 d-flex align-items-end">
                    <button
                        type="submit"
                        className="btn btn-info btn-block w-100"
                        disabled={submitting}
                    >
                        {submitting ? 'Agregando...' : '+ Agregar'}
                    </button>
                </div>
            </div>

            {/* Error general del servidor */}
            {apiErrors.general && (
                <div className="alert alert-danger mt-2 py-2">{apiErrors.general}</div>
            )}
        </form>
    );
}