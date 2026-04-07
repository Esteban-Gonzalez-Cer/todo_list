import { z } from 'zod';

export const PRIORITIES = ['Alta', 'Media', 'Baja'];

export const todoSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2,  { message: 'El título debe tener al menos 2 caracteres.' })
        .max(100, { message: 'El título no puede superar los 100 caracteres.' }),

    description: z
        .string()
        .trim()
        .min(2,  { message: 'La descripción debe tener al menos 2 caracteres.' })
        .max(300, { message: 'La descripción no puede superar los 300 caracteres.' }),

    priority: z
        .enum(PRIORITIES, { message: 'La prioridad debe ser Alta, Media o Baja.' })
        .default('Baja'),
});

export const editTodoSchema = todoSchema.extend({
    completed: z.boolean().default(false),
});