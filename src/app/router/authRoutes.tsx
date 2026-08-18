import type { RouteObject } from "react-router-dom";

import AuthLayout from "@/app/layouts/AuthLayout";
import Login from "@/pages/Login";

export const authRoutes: RouteObject = {
  element: <AuthLayout />,
  children: [
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "signup",
      // element: <Signup />,
    },
  ],
};
