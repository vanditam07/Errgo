import { z } from 'zod';

/**
 * Interface representing a Project entity.
 * 
 * This structure is used internally and includes all fields, including the unique `id`.
 */
export interface IProject {
  /** Unique identifier for the project (UUID format) */
  id: string;

  /** Name of the project */
  name: string;

  /** Description providing more details about the project */
  description: string;
}

/**
 * Zod schema used to validate a full `IProject` object.
 * 
 * This includes validation for:
 * - `id` being a valid UUID string
 * - `name` being a non-empty string
 * - `description` being a non-empty string
 */
export const ProjectSchema = z.object({
  id: z.string().uuid(), // Must be a valid UUID string
  name: z.string().min(1, { message: 'Name cannot be empty' }),
  description: z.string().min(1, { message: 'Description cannot be empty' }),
});

/**
 * Zod schema used to validate a `Project` object input from clients.
 * 
 * This version excludes the `id` field, which is typically generated on the backend.
 * 
 * Example use-case:
 * ```ts
 * const result = ProjectInputSchema.safeParse(req.body);
 * ```
 */
export const ProjectInputSchema = ProjectSchema.omit({ id: true });
