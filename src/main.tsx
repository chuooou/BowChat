import "./index.css";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";

import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

import AuthProvider from "@/app/providers/auth/AuthProvider";
import { router } from "@/app/router/router";

import { QueryProvider } from "./app/providers/QueryProvider";

async function enableMocking() {
  if (!import.meta.env.DEV) {
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
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryProvider>,
  );
});
