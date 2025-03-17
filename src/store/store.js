import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '../store/todoSlice'

export const store = configureStore({
  reducer: {
    todo: todoReducer
  }
})