'use client';

import React, { useEffect, useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import supabase from '../../utils/superbaseClient';

export default function Home() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const { data, error } = await supabase.from('tasks').select('*');

    if (error) {
      alert('Error fetching tasks: ' + error.message);
    } else {
      setTasks(data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Task Management</h1>

      <TaskList tasks={tasks} />
    </>
  );
}
