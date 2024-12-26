'use client';

import { useState } from 'react';
import supabase from '../../utils/superbaseClient';

const TaskForm = ({ fetchTasks, setTasks, tasks }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) return;

    const newTask = { title, description, status };

    // Optimistically add the new task to the tasks state
    setTasks([newTask, ...tasks]);

    // Now insert the task into the database
    const { data, error } = await supabase.from('tasks').insert([newTask]);

    if (error) {
      setError(error.message); // Set error message
      // Revert the optimistic update if the task addition failed
      fetchTasks(); // Fetch tasks again in case of failure to update state
    } else {
      // Clear form fields on success
      setTitle('');
      setDescription('');
      setStatus('pending');
      setError(''); // Clear error if successful
      fetchTasks(); // Optionally, fetch tasks after the insert to sync DB
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-md">
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="status" className="block text-gray-700">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-md"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
