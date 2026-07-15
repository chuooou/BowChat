import { createBrowserRouter } from "react-router-dom";

import RootLayout from "@/app/layouts/RootLayout";
import AuctionList from "@/pages/AuctionList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <AuctionList />,
      },
    ],
  },
]);
