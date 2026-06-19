import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.tsx"],
    css: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify("http://localhost:3333"),
    "import.meta.env.VITE_FIREBASE_API_KEY": JSON.stringify("test-key"),
    "import.meta.env.VITE_FIREBASE_AUTH_DOMAIN": JSON.stringify("test.firebaseapp.com"),
    "import.meta.env.VITE_FIREBASE_PROJECT_ID": JSON.stringify("test-project"),
    "import.meta.env.VITE_FIREBASE_STORAGE_BUCKET": JSON.stringify("test.appspot.com"),
    "import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID": JSON.stringify("123"),
    "import.meta.env.VITE_FIREBASE_APP_ID": JSON.stringify("1:123:web:abc"),
  },
});
