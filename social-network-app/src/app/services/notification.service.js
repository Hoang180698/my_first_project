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
            query: () =>  `notification`,
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
        })
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
   useGetAllNotificationQuery,
   useSeenNotificationMutation,
   useDeleteNotificationByIdMutation,
   useDeleteAllNotificationMutation,
} = notificationApi;
