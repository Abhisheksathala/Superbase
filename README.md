This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Documentation

### Overview

This project is a task management API built using Next.js and Supabase. The API allows users to create, read, update, and delete tasks. The following documentation provides detailed information about the files, routes, and how to use them.

### File Structure

- `superbaseClient.js`: Contains the Supabase client configuration.
- `[id].js`: Handles API requests for specific tasks by ID.
- `index.js`: Handles API requests for creating and retrieving tasks.

### Supabase Client Configuration

**File: `superbaseClient.js`**

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

export default supabase;
```

This file initializes the Supabase client using environment variables for the URL and key. The client is then exported for use in other parts of the application.

### Task API Endpoints

#### Get, Update, and Delete Task by ID

**File: `pages/api/tasks/[id].js`**

```javascript
import supabase from '../../../utils/superbaseClient.js';

// Get a specific task by id
export const getTaskById = async (req, res) => {
  const { id } = req.query;
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Task not found' });

  return res.status(200).json({ data });
};

// Update a specific task by id
export const updateTask = async (req, res) => {
  const { id } = req.query;
  const { title, description, status } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const { data, error } = await supabase
    .from('tasks')
    .update({ title, description, status })
    .eq('id', id);

  if (error || !data)
    return res.status(404).json({ error: 'Task not found or update failed' });

  return res.status(200).json({ data });
};

// Delete a specific task by id
export const deleteTask = async (req, res) => {
  const { id } = req.query;

  const { data, error } = await supabase.from('tasks').delete().eq('id', id);

  if (error || !data)
    return res.status(404).json({ error: 'Task not found or deletion failed' });

  return res.status(200).json({ message: 'Task deleted' });
};

// Main API handler
export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getTaskById(req, res);
  } else if (req.method === 'PUT') {
    return updateTask(req, res);
  } else if (req.method === 'DELETE') {
    return deleteTask(req, res);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
```

This file defines three main functions to handle GET, PUT, and DELETE requests for tasks by ID. The handler function routes the request to the appropriate function based on the HTTP method.

#### Create and Retrieve Tasks

**File: `pages/api/tasks/index.js`**

```javascript
import supabase from '../../../utils/superbaseClient.js';

export default async function handler(req, res) {
  const { method, query } = req;

  switch (method) {
    case 'POST': {
      // Add a new task
      const { title, description, status } = req.body;

      // Validate input
      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }

      // Insert task into the database
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ title, description, status }]);

      if (error) {
        console.error('Error inserting task:', error);
        return res.status(500).json({ message: error.message });
      }

      return res.status(201).json({ data });
    }

    case 'GET': {
      // Get tasks (optional filtering by status)
      const { status } = query;

      let queryBuilder = supabase.from('tasks').select('*');
      if (status) {
        queryBuilder = queryBuilder.eq('status', status);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(200).json({ data });
    }

    default:
      // Handle unsupported methods
      res.setHeader('Allow', ['POST', 'GET']);
      return res.status(405).json({ message: `Method ${method} not allowed` });
  }
}
```

This file defines a single handler function to handle POST and GET requests for tasks. The POST request adds a new task, while the GET request retrieves tasks, optionally filtering by status.

### API Routes

#### Create a Task

**Endpoint:** `/api/tasks`  
**Method:** `POST`  
**Request Body:**

```json
{
  "title": "Task Title",
  "description": "Task Description",
  "status": "pending"
}
```

**Response:**

- `201 Created`: Returns the created task.
- `400 Bad Request`: If the title is missing.
- `500 Internal Server Error`: If there is an error inserting the task.

#### Retrieve Tasks

**Endpoint:** `/api/tasks`  
**Method:** `GET`  
**Query Parameters:**

- `status` (optional): Filter tasks by status.

**Response:**

- `200 OK`: Returns the list of tasks.
- `500 Internal Server Error`: If there is an error retrieving the tasks.

#### Retrieve a Task by ID

**Endpoint:** `/api/tasks/[id]`  
**Method:** `GET`  
**Query Parameters:**

- `id`: The ID of the task to retrieve.

**Response:**

- `200 OK`: Returns the task.
- `404 Not Found`: If the task is not found.

#### Update a Task by ID

**Endpoint:** `/api/tasks/[id]`  
**Method:** `PUT`  
**Request Body:**

```json
{
  "title": "Updated Task Title",
  "description": "Updated Task Description",
  "status": "completed"
}
```

**Response:**

- `200 OK`: Returns the updated task.
- `400 Bad Request`: If the title is missing.
- `404 Not Found`: If the task is not found or update failed.

#### Delete a Task by ID

**Endpoint:** `/api/tasks/[id]`  
**Method:** `DELETE`  
**Query Parameters:**

- `id`: The ID of the task to delete.

**Response:**

- `200 OK`: Returns a message indicating the task was deleted.
- `404 Not Found`: If the task is not found or deletion failed.

### Testing the API

To test the API, you can use tools like Postman or cURL to make HTTP requests to the endpoints described above. Ensure that your Supabase environment variables are correctly set in your `.env` file.

### Example Requests

#### Create a Task

```bash
curl -X POST http://localhost:3000/api/tasks \
 -H "Content-Type: application/json" \
 -d '{
  "title": "New Task",
  "description": "This is a new task",
  "status": "pending"
}'
```

#### Retrieve Tasks

```bash
curl -X GET http://localhost:3000/api/tasks
```

#### Retrieve a Task by ID

```bash
curl -X GET http://localhost:3000/api/tasks/1
```

#### Update a Task by ID

```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
 -H "Content-Type: application/json" \
 -d '{
  "title": "Updated Task",
  "description": "This task has been updated",
  "status": "completed"
}'
```

#### Delete a Task by ID

```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

This documentation should help you understand the structure and functionality of the API, as well as how to interact with it using various HTTP methods.