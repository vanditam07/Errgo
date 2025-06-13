import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import http from 'http';

/**
 * Zod schema to validate project input from request body.
 * Ensures `name` and `description` are non-empty strings.
 */
const ProjectInputSchema = z.object({
  name: z.string().min(1, { message: 'Project name is required.' }),
  description: z.string().min(1, { message: 'Project description is required.' }),
});

/**
 * Interface representing a Project with ID.
 */
interface IProject extends z.infer<typeof ProjectInputSchema> {
  /** Unique identifier for the project */
  id: string;
}

// -------------------- App Setup --------------------

const app = express();
const PORT = 3000;

/** In-memory store for projects (non-persistent) */
const projects: IProject[] = [];

/** CORS and JSON middleware setup */
app.use(cors({ origin: '*', methods: ['GET', 'POST'], credentials: true }));
app.use(express.json());

/**
 * Middleware for logging all incoming requests.
 */
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method !== 'GET') {
    console.log('Request Body:', JSON.stringify(req.body));
  }
  next();
});

/**
 * Wraps async route handlers to automatically pass errors to Express error handler.
 * @param fn - Async function to wrap
 * @returns Middleware function
 */
const asyncHandler = (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// -------------------- Routes --------------------

/**
 * Health check route
 * @route GET /
 */
app.get('/', (_req: Request, res: Response) => {
  res.send('Errgo Backend Interview Module Loaded Successfully!');
});

/**
 * Create a new project
 * @route POST /projects
 * @body { project: { name: string, description: string } }
 */
app.post(
  '/projects',
  asyncHandler(async (req: Request, res: Response) => {
    const { project } = req.body;

    if (!project) {
      return res.status(400).json({ error: 'Missing project object in request body.' });
    }

    const result = ProjectInputSchema.safeParse(project);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten().fieldErrors });
    }

    const newProject: IProject = {
      id: uuid(),
      ...result.data,
    };

    projects.push(newProject);
    console.log(`Project created: ${JSON.stringify(newProject)}`);
    res.status(201).json(newProject);
  })
);

/**
 * Get all projects
 * @route GET /projects
 * @returns List of all projects
 */
app.get('/projects', (_req: Request, res: Response) => {
  res.status(200).json(projects);
});

/**
 * Get a single project by ID
 * @route GET /projects/:id
 * @param id - Project UUID
 */
app.get(
  '/projects/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const project = projects.find((p) => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    res.status(200).json(project);
  })
);

// -------------------- Fallback Handlers --------------------

/**
 * Catch-all handler for undefined routes
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found.' });
});

/**
 * Global error handler
 */
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] Internal error:`, err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// -------------------- Start Server --------------------

/**
 * HTTP server is exported so it can be used by WebSocket as well.
 */
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default server;
