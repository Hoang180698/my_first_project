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
        // Lấy danh sách các cuộc trò chuyện
        getConversations: builder.query({
            query: ({ page, pageSize }) =>  `chat?page=${page}&pageSize=${pageSize}`,
        }),
        // Lấy danh sách các cuộc trò chuyện trong kho lưu trữ
        getArchiveConversations: builder.query({
            query: ({ page, pageSize }) =>  `chat/archive?page=${page}&pageSize=${pageSize}`,
        }),
        // Lấy thông tin cuộc hôị thoại theo id
        getConversationById: builder.query({
            query: (id) =>  `chat/${id}`,
            providesTags: ["Post"],
        }),
        // Tạo chát đơn
        createConversation: builder.mutation({
            query: (data) => ({
                url: "chat",
                method: "POST",
                body: (data)
            }),
        }),
        // Tạo chát nhóm
        createGroupChat: builder.mutation({
            query: (data) => ({
                url: "chat/group-chat",
                method: "POST",
                body: (data)
            }),
        }),
        // Lấy danh sách tin nhắn
        getMessages: builder.query({
            query: ({conversationId, page, pageSize}) => `chat/message/${conversationId}?page=${page}&pageSize=${pageSize}`, 
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
            invalidatesTags: ["Unread", "Post"],
        }),
        toggleArchiveChat: builder.mutation({
            query: (conversationId) => ({
                url: `chat/archive-chat/${conversationId}`,
                method: "PUT",
            }),
            invalidatesTags: ["Unread"],
        }),
        toggleSetNoticeSound: builder.mutation({
            query: (conversationId) => ({
                url: `chat/notice-sound/${conversationId}`,
                method: "PUT",
            }),
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
    useResetUnreadCountByConversationIdMutation,
    useCreateGroupChatMutation,
    useLazyGetArchiveConversationsQuery,
    useToggleArchiveChatMutation,
    useToggleSetNoticeSoundMutation,
} = chatApi;