import { createSlice } from "@reduxjs/toolkit";
import { chatApi } from "../services/chat.service";

const initialState = {
  unreadMessageCount: 0,
  conversationReceive: null, //user-conversation
  isOpenChatPage: false,
  messageRecieve: null,
  groupCallReceive: null  // conversatioon
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
    setGroupCallReceive: (state, action) => {
      state.groupCallReceive = action.payload;
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

export const { receiveMessage, openChatPage, closeChatPage, setConversationReceive, setMessageRecieve, setGroupCallReceive } = chatSlice.actions;

export default chatSlice.reducer;
