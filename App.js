import { useState, useEffect } from 'react';
import TodoList from './TodoList';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  // Cargar tareas desde localStorage al iniciar
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        const tasksWithDates = parsedTasks.map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : null
        }));
        setTasks(tasksWithDates);
      } catch (error) {
        console.error('Error al cargar tareas:', error);
      }
    }
  }, []);

  // Guardar tareas en localStorage cada vez que cambien
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === '') {
      setError('❌ No puedes agregar una tarea vacía');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const isDuplicate = tasks.some(t => t.text.toLowerCase() === task.trim().toLowerCase());
    if (isDuplicate) {
      setError('❌ Esta tarea ya existe en la lista');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const newTask = {
      id: Date.now(),
      text: task.trim(),
      createdAt: new Date(),
      dueDate: dueDate ? new Date(dueDate) : null,
      completed: false
    };

    setTasks([...tasks, newTask]);
    setTask('');
    setDueDate('');
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const deleteTask = (id) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
    
    if (newTasks.length === 0) {
      localStorage.removeItem('tasks');
    }
  };

  const completeTask = (id) => {
    const newTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const editTask = (id, newText, newDueDate) => {
    const newTasks = tasks.map(task =>
      task.id === id 
        ? { ...task, text: newText, dueDate: newDueDate ? new Date(newDueDate) : null } 
        : task
    );
    setTasks(newTasks);
  };

  const clearAllTasks = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todas las tareas?')) {
      setTasks([]);
      localStorage.removeItem('tasks');
    }
  };

  return (
    <div className="container">
      <h1>📝 Lista de Tareas</h1>
      
      <div className="task-counter">
        <span>📊 Total: {tasks.length}</span>
        <span>✅ Completadas: {tasks.filter(t => t.completed).length}</span>
        <span>⏳ Pendientes: {tasks.filter(t => !t.completed).length}</span>
      </div>

      <div className="input-section">
        <div className="input-container">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe una tarea..."
            className="task-input"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="date-input"
          />
          <button onClick={addTask} className="btn-add">Agregar</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <TodoList 
        tasks={tasks}
        onDelete={deleteTask}
        onComplete={completeTask}
        onEdit={editTask}
      />

      {tasks.length === 0 && (
        <p className="empty-message">
          No hay tareas. ¡Agrega una para comenzar! 🚀
        </p>
      )}

      {tasks.length > 0 && (
        <button onClick={clearAllTasks} className="btn-clear-all">
          🗑️ Limpiar Todas las Tareas
        </button>
      )}

      <div className="storage-indicator">
        💾 Tus tareas se guardan automáticamente
      </div>
    </div>
  );
}

export default App;
