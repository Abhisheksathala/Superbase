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
