"use client";

import * as React from "react";

const shouldEnableMockApi =
  process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_ENABLE_MOCK_API === "true";

function MswProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(!shouldEnableMockApi);

  React.useEffect(() => {
    if (!shouldEnableMockApi) {
      return;
    }

    let active = true;

    async function enableMocking() {
      const { worker } = await import("@/mocks/browser");

      await worker.start({
        onUnhandledRequest: "bypass",
        serviceWorker: {
          url: "/mockServiceWorker.js",
        },
      });

      if (active) {
        setReady(true);
      }
    }

    enableMocking().catch((error: unknown) => {
      console.error("Failed to start Mock Service Worker", error);

      if (active) {
        setReady(true);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}

export { MswProvider };
