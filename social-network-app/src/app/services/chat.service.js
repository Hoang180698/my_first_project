import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const chatApi = createApi({
    reducerPath: "chatApi",
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
    tagTypes: ["Post","Unread"],
    endpoints: (builder) => ({
        getConversations: builder.query({
            query: () =>  "chat",
            providesTags: ["Post"],
        }),
        getConversationById: builder.query({
            query: (id) =>  `chat/${id}`,
            providesTags: ["Post"],
        }),
        createConversation: builder.mutation({
            query: (data) => ({
                url: "chat",
                method: "POST",
                body: (data)
            }),
            invalidatesTags: ["Post"],
        }),
        getMessages: builder.query({
            query: (conversationId) => `chat/message/${conversationId}`, 
            providesTags: ["Post"],
        }),
        getAllUnreadMessageCount: builder.query({
            query: () =>  "chat/unread-count",
            providesTags: ["Unread"],
        }),
        resetUnreadCountByConversationId: builder.mutation({
            query: (conversationId) => ({
                url: `chat/read/${conversationId}`,
                method: "PUT",
            }),
            invalidatesTags: ["Unread"],
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useCreateConversationMutation,
    useGetConversationsQuery,
    useGetMessagesQuery,
    useGetConversationByIdQuery,
    useLazyGetMessagesQuery,
    useLazyGetConversationsQuery,
    useGetAllUnreadMessageCountQuery,
    useResetUnreadCountByConversationIdMutation
} = chatApi;