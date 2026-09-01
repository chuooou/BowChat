import "./index.css";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";

import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

import { router } from "@/app/router/router";

import { QueryProvider } from "./app/providers/QueryProvider";

async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW !== "true") {
    return;
  }

  const { worker } = await import("@/mocks/browser");

  return worker.start({
    onUnhandledRequest: "bypass",
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <QueryProvider>
      <RouterProvider router={router} />
      <Toaster />
    </QueryProvider>,
  );
});
