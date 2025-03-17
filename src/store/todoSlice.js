import { createSlice } from '@reduxjs/toolkit';

const loadTasksFromLocalStorage = () => {
  try {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
};

const saveTasksToLocalStorage = (tasks) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

const todoSlice = createSlice({
  name: 'todo',
  initialState: loadTasksFromLocalStorage(),
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        id: Date.now(),
        task: action.payload,
        isCompleted: false
      };
      
      state.push(newTask);
      saveTasksToLocalStorage(state);
    },
    toggleTask: (state, action) => {
      const { id, isCompleted } = action.payload;
      const updatedTasks = state.map(task =>
        task.id === id ? { ...task, isCompleted } : task
      );
      saveTasksToLocalStorage(updatedTasks);
      return updatedTasks;
    },
    deleteTask: (state, action) => {
      const id = action.payload;
      const index = state.findIndex(task => task.id === id);
      if (index !== -1) {
        state.splice(index, 1);
        saveTasksToLocalStorage(state);
      }
    },
    deleteCompletedTasks: (state) => {
      const updatedState = state.filter(task => !task.isCompleted);
      saveTasksToLocalStorage(updatedState);
      return updatedState;
    }
  }
});

export const { addTask, toggleTask, deleteTask, deleteCompletedTasks } = todoSlice.actions;
export default todoSlice.reducer;