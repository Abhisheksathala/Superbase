'use client';
import { useState } from 'react';
import supabase from '../../utils/superbaseClient';

const TaskItem = ({ task, fetchTasks }) => {
  const [loading, setLoading] = useState(false); // Handle loading state for async operations

  const handleDelete = async () => {
    setLoading(true); // Set loading state before starting deletion
    const { error } = await supabase.from('tasks').delete().eq('id', task.id);

    if (error) {
      alert(error.message);
    } else {
      fetchTasks(); // Fetch updated tasks after deletion
    }
    setLoading(false); // Reset loading state after operation
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true); // Set loading state before status update
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', task.id);

    if (error) {
      alert(error.message);
    } else {
      fetchTasks(); // Fetch updated tasks after status change
    }
    setLoading(false); // Reset loading state after operation
  };

  // Handle the case if the task is missing (should not happen but added for safety)
  if (!task) {
    return null;
  }

  return (
    <div className="bg-white p-4 mb-2 rounded-md shadow-md">
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => handleStatusChange('in-progress')}
          className="bg-yellow-500 text-white p-1 rounded-md"
          disabled={loading} // Disable buttons while loading
        >
          In Progress
        </button>
        <button
          onClick={() => handleStatusChange('completed')}
          className="bg-green-500 text-white p-1 rounded-md"
          disabled={loading} // Disable buttons while loading
        >
          Completed
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white p-1 rounded-md"
          disabled={loading} // Disable buttons while loading
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
