import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getAllNotification: builder.query({
      query: ({ page, pageSize }) =>
        `notification?page=${page}&pageSize=${pageSize}`,
      providesTags: ["Post"],
    }),
    seenNotification: builder.mutation({
      query: () => ({
        url: "notification",
        method: "PUT",
      }),
      invalidatesTags: ["Post"],
    }),
    deleteNotificationById: builder.mutation({
      query: (id) => ({
        url: `notification/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
    deleteAllNotification: builder.mutation({
      query: () => ({
        url: `notification`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
    getNotificationStatus: builder.query({
      query: () => `notifications-status`,
    }),
    updateLikeStatus: builder.mutation({
      query: () => ({
        url: "notifications-status/likes",
        method: "PUT",
      }),
    }),
    updateCommentStatus: builder.mutation({
      query: () => ({
        url: "notifications-status/comments",
        method: "PUT",
      }),
    }),
    updateNewFollowerStatus: builder.mutation({
      query: () => ({
        url: "notifications-status/new-follower",
        method: "PUT",
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllNotificationQuery,
  useSeenNotificationMutation,
  useDeleteNotificationByIdMutation,
  useDeleteAllNotificationMutation,
  useLazyGetAllNotificationQuery,
  useLazyGetNotificationStatusQuery,
  useUpdateCommentStatusMutation,
  useUpdateLikeStatusMutation,
  useUpdateNewFollowerStatusMutation,
} = notificationApi;
