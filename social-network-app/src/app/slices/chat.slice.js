import { createSlice } from "@reduxjs/toolkit";
import { chatApi } from "../services/chat.service";

const initialState = {
  unreadMessageCount: 0,
  conversationReceive: null,
  isOpenChatPage: false,
  messageRecieve: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    receiveMessage: (state, action) => {
      state.unreadMessageCount = state.unreadMessageCount + 1;
    },
    openChatPage: (state, action) => {
      state.isOpenChatPage = true;
    },
    closeChatPage: (state, action) => {
      state.isOpenChatPage = false;
    },
    setConversationReceive: (state, action) => {
      state.conversationReceive = action.payload;
    },
    setMessageRecieve: (state, action) => {
      state.messageRecieve = action.payload;
  },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      chatApi.endpoints.getAllUnreadMessageCount.matchFulfilled,
      (state, action) => {
        state.unreadMessageCount = action.payload.unreadMessageCount;
      }
    );
  },
});

export const { receiveMessage, openChatPage, closeChatPage, setConversationReceive, setMessageRecieve } = chatSlice.actions;

export default chatSlice.reducer;
