import { createApi } from '@reduxjs/toolkit/query/react';
import customFetchBase from './customFetchBase';
import { IClassroom } from './types';

export const classroomApi = createApi({
  reducerPath: 'classroomApi',
  baseQuery: customFetchBase,
  tagTypes: ['Classrooms'],
  endpoints: (builder) => ({
    createClassroom: builder.mutation<IClassroom, FormData>({
      query(classroom) {
        return {
          url: '/classrooms',
          method: 'POST',
          //credentials: 'include',
          body: classroom,
        };
      },
      invalidatesTags: [{ type: 'Classrooms', id: 'LIST' }],
      transformResponse: (result: { data: { classroom: IClassroom } }) =>
        result.data.classroom,
    }),
    updateClassroom: builder.mutation<IClassroom, { id: string; classroom: FormData }>(
      {
        query({ id, classroom }) {
          return {
            url: `/classrooms/${id}`,
            method: 'PATCH',
            //credentials: 'include',
            body: classroom,
          };
        },
        invalidatesTags: (result, error, { id }) =>
          result
            ? [
                { type: 'Classrooms', id },
                { type: 'Classrooms', id: 'LIST' },
              ]
            : [{ type: 'Classrooms', id: 'LIST' }],
        transformResponse: (response: { data: { classroom: IClassroom } }) =>
          response.data.classroom,
      }
    ),
    getClassroom: builder.query<IClassroom, string>({
      query(id) {
        return {
          url: `/clasrooms/${id}`,
          //credentials: 'include',
        };
      },
      providesTags: (result, error, id) => [{ type: 'Classrooms', id }],
    }),
    getAllClassrooms: builder.query<IClassroom[], void>({
      query() {
        return {
          url: `/classrooms`,
          //credentials: 'include',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Classrooms' as const,
                id,
              })),
              { type: 'Classrooms', id: 'LIST' },
            ]
          : [{ type: 'Classrooms', id: 'LIST' }],
      transformResponse: (results: { data: { classrooms: IClassroom[] } }) =>
        results.data.classrooms,
    }),
    deleteClassroom: builder.mutation<IClassroom, string>({
      query(id) {
        return {
          url: `/classrooms/${id}`,
          method: 'Delete',
          //credentials: 'include',
        };
      },
      invalidatesTags: [{ type: 'Classrooms', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateClassroomMutation,
  useDeleteClassroomMutation,
  useUpdateClassroomMutation,
  useGetAllClassroomsQuery,
} = classroomApi;
