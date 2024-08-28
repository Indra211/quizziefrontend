import { createBrowserRouter } from "react-router-dom";
import {
  Analytics,
  Dashboard,
  Home,
  QuestionWiseDetail,
  QuizInterface,
  Register,
} from "../pages";
import { App } from "../App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "register", element: <Register /> },
      {
        path: "",
        element: <Home />,
        children: [
          { path: "", element: <Dashboard /> },
          { path: "/analytics", element: <Analytics /> },
          { path: "/getQuizQuestion/:id", element: <QuestionWiseDetail /> },
        ],
      },
      { path: "quiz/:id", element: <QuizInterface /> },
    ],
  },
]);
