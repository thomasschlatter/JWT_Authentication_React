import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IClassroom } from '../api/types';

interface IClassroomState {
  post: IClassroom | null;
}

const initialState: IClassroomState = {
  post: null,
};

export const classroomSlice = createSlice({
  initialState,
  name: 'classroomSlice',
  reducers: {
    postState: (state, action: PayloadAction<IClassroom>) => {
      state.post = action.payload;
    },
  },
});

export default classroomSlice.reducer;

export const { postState } = classroomSlice.actions;
