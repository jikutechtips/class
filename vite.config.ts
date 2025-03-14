import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Create a vendor chunk for node_modules
            return "vendor";
          }
          //create chunks for pages.
          if (id.includes("/pages/")) {
            const pageName = id.substring(
              id.lastIndexOf("/pages/") + "/pages/".length,
              id.lastIndexOf(".")
            );
            return `page-${pageName}`;
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Adjust the warning limit if needed (in kB)
  },
});
