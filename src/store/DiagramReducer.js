// src/redux/classDiagramSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  classes: [],
  relationships: [],
};

const DiagramReducer = createSlice({
  name: 'classDiagram',
  initialState,
  reducers: {
    setDiagram(state, action) {
      return action.payload; // overwrite with the new diagram
    },
    clearDiagram() {
      return initialState;   // reset to blank
    },
  },
});

export const { setDiagram, clearDiagram } = DiagramReducer.actions;
export default DiagramReducer.reducer;
