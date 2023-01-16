import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { authApi } from './api/authApi';
import { postApi } from './api/postApi';
import { userApi } from './api/userApi';
import userReducer from './features/userSlice';
import postReducer from './features/postSlice';
import classroomReducer from './features/classroomSlice';
import { classroomApi } from './api/classroomApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    // Connect the PostApi reducer to the store
    [postApi.reducerPath]: postApi.reducer,
    [classroomApi.reducerPath]: classroomApi.reducer,
    userState: userReducer,
    postState: postReducer,
    classroomState: classroomReducer,
  },
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      authApi.middleware,
      userApi.middleware,
      // Add the PostApi middleware to the store
      postApi.middleware,
      classroomApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
