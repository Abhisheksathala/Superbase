import supabase from '../../../utils/superbaseClient.jsx';

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
