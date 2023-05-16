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
    tagTypes: ["Post"],
    endpoints: (builder) => ({
        getContacts: builder.query({
            query: () =>  "chat",
            providesTags: ["Post"],
        }),
        getContactById: builder.query({
            query: (id) =>  `chat/${id}`,
            providesTags: ["Post"],
        }),
        createContact: builder.mutation({
            query: (data) => ({
                url: "chat",
                method: "POST",
                body: (data)
            }),
            invalidatesTags: ["Post"],
        }),
        getMessages: builder.query({
            query: (contactId) => `chat/message/${contactId}`, 
            providesTags: ["Post"],
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useCreateContactMutation,
    useGetContactsQuery,
    useGetMessagesQuery,
    useGetContactByIdQuery,
    useLazyGetMessagesQuery,
} = chatApi;