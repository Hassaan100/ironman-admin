import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const baseApi = createApi({
  reducerPath: 'adminBaseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include', // Automatically passes httpOnly cookie
    prepareHeaders: (headers, { getState }) => {
      let token = (getState() as any)?.adminAuth?.token;
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('ironman_admin_token');
      }
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['AdminAuth', 'PlatformStats', 'Gyms'],
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['AdminAuth', 'PlatformStats'],
    }),
    getAdminMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['AdminAuth'],
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['AdminAuth'],
    }),

    // Platform SaaS Statistics
    getPlatformStats: builder.query({
      query: () => '/reports/admin-platform',
      providesTags: ['PlatformStats', 'Gyms'],
    }),

    // Gym Fleet Management
    getAllGyms: builder.query({
      query: (params) => ({
        url: '/gyms',
        params,
      }),
      providesTags: ['Gyms'],
    }),
    getGymById: builder.query({
      query: (id) => `/gyms/${id}`,
      providesTags: (result, error, id) => [{ type: 'Gyms', id }],
    }),
    createGym: builder.mutation({
      query: (body) => ({
        url: '/gyms',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Gyms', 'PlatformStats'],
    }),
    updateGym: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/gyms/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Gyms', 'PlatformStats'],
    }),
    deleteGym: builder.mutation({
      query: (id) => ({
        url: `/gyms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Gyms', 'PlatformStats'],
    }),

    // Image & Logo Upload
    uploadImage: builder.mutation({
      query: (formData: FormData) => ({
        url: '/upload',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useGetAdminMeQuery,
  useAdminLogoutMutation,
  useGetPlatformStatsQuery,
  useGetAllGymsQuery,
  useGetGymByIdQuery,
  useCreateGymMutation,
  useUpdateGymMutation,
  useDeleteGymMutation,
  useUploadImageMutation,
} = baseApi;
