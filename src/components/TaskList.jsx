'use client';

import { useState, useEffect } from 'react';
import supabase from '../../utils/superbaseClient';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const { data, error } = await supabase.from('tasks').select('*');

    if (error) {
      alert('Error fetching tasks: ' + error.message);
    } else {
      setTasks(data); // Update tasks with the fetched data
    }
  };

  // Fetch tasks when the component is mounted
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Tasks</h2>
      <TaskForm
        fetchTasks={fetchTasks}
        setTasks={setTasks}
        tasks={tasks}
      />{' '}
      {/* Pass fetchTasks and tasks as props */}
      <div>
        {tasks.map((task) => (
          // Make sure to pass a unique key prop
          <TaskItem key={task.id} task={task} fetchTasks={fetchTasks} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
