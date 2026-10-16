import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const getBackendUrl = (mode: string) => {
  const env = loadEnv(mode, process.cwd(), '')

  const backendUrl = env.BACKEND_HOST && env.BACKEND_PORT ? `${env.BACKEND_HOST}:${env.BACKEND_PORT}` : "http://localhost:3000";
  
  console.log(backendUrl)


  return backendUrl
}

export default defineConfig(({mode}) => ({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        //target: "http://localhost:3001",
        target: getBackendUrl(mode),
        changeOrigin: true,
      },
    },
  },
}));
