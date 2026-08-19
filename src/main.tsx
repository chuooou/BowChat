import "./index.css";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";

import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

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
      <RouterProvider router={router} />
    </QueryProvider>,
  );
});
