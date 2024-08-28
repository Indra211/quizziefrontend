import { configureStore } from "@reduxjs/toolkit";
import { QuizReducer } from "./features";

export const store = configureStore({
  reducer: {
    quiz: QuizReducer,
  },
});
