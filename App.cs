import React, { useState } from 'react';

function TodoItem({ task, onDelete, onComplete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editDueDate, setEditDueDate] = useState(
    task.dueDate ? task.dueDate.toISOString().split('T')[0] : ''
  );

  const formatDateTime = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const handleSave = () => {
    if (editText.trim() !== '') {
      onEdit(task.id, editText.trim(), editDueDate);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditDueDate(task.dueDate ? task.dueDate.toISOString().split('T')[0] : '');
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const isOverdue = task.dueDate && !task.completed && new Date() > task.dueDate;

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      {isEditing ? (
        <div className="task-edit-mode">
          <div className="edit-inputs">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="edit-input"
              autoFocus
            />
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="edit-date-input"
            />
          </div>
          <div className="edit-buttons">
            <button onClick={handleSave} className="btn-save" title="Guardar">
              💾
            </button>
            <button onClick={handleCancel} className="btn-cancel" title="Cancelar">
              ❌
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-content">
            <div className="task-main">
              <span className="task-text">{task.text}</span>
              {isOverdue && <span className="overdue-badge">⚠️ Vencida</span>}
            </div>
            <div className="task-dates">
              <span className="task-created">
                📅 Creada: {formatDateTime(task.createdAt)}
              </span>
              {task.dueDate && (
                <span className="task-due">
                  🎯 Vence: {formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
          <div className="task-buttons">
            <button 
              className="btn-complete" 
              onClick={() => onComplete(task.id)}
              title={task.completed ? "Marcar como pendiente" : "Marcar como completada"}
            >
              {task.completed ? '↺' : '✓'}
            </button>
            <button 
              className="btn-edit" 
              onClick={() => setIsEditing(true)}
              title="Editar tarea"
            >
              ✏️
            </button>
            <button 
              className="btn-delete" 
              onClick={() => onDelete(task.id)}
              title="Eliminar tarea"
            >
              🗑️
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default TodoItem;
