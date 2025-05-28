import { configureStore } from '@reduxjs/toolkit';
import { chatReducer } from './chatReducer';
import DiagramReducer from './DiagramReducer'; // ✅ Add your diagram reducer

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    classDiagram: DiagramReducer, // ✅ Connect your DiagramReducer here
  },
});
