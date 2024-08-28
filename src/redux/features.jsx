import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizs: [],
  quizUpdates: "",
};

const QuizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setQuizs: (state, action) => {
      state.quizs = action.payload;
    },
    setQuizUpdates: (state, action) => {
      state.quizUpdates = action.payload;
    },
  },
});

export const { setQuizs, setQuizUpdates } = QuizSlice.actions;
export const QuizReducer = QuizSlice.reducer;
