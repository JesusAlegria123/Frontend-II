import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ tasks, onDelete, onComplete, onEdit }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onComplete={onComplete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default TodoList;
