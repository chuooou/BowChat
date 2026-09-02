import { createBrowserRouter } from "react-router-dom";

import RootLayout from "@/app/layouts/RootLayout";
import AuthGuard from "@/app/router/AuthGuard";
import { authRoutes } from "@/app/router/authRouter";
import AuctionList from "@/pages/AuctionList";
import NotFound from "@/pages/NotFound";
import ProductDetail from "@/pages/products/Detail";
import Register from "@/pages/products/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        element: <AuthGuard mode="protected" />,
        children: [
          {
            path: "products",
            children: [
              {
                path: "register",
                element: <Register />,
              },
            ],
          },
        ],
      },
      {
        path: "products/:id",
        element: <ProductDetail />,
      },
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
  {
    element: <AuthGuard mode="guest" />,
    children: [authRoutes],
  },
]);
