import { createBrowserRouter } from "react-router-dom";

import RootLayout from "@/app/layouts/RootLayout";
import { authRoutes } from "@/app/router/authRouter";
import AuctionList from "@/pages/AuctionList";
import NotFound from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <AuctionList />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  authRoutes,
]);
