import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createLocalAdminApiMiddleware } from './scripts/viteLocalAdminApi.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiProxy = env.VITE_DEV_API_PROXY?.trim()
  return {
    plugins: [
      react(),
      {
        name: 'local-admin-api',
        configureServer(server) {
          if (apiProxy) return
          const serverEnv = loadEnv(server.config.mode, server.config.envDir || process.cwd(), '')
          for (const [key, value] of Object.entries(serverEnv)) {
            if (value !== undefined && value !== '') process.env[key] = value
          }
          server.middlewares.use(createLocalAdminApiMiddleware())
        },
      },
    ],
    ...(apiProxy
      ? {
          server: {
            proxy: {
              '/api': { target: apiProxy, changeOrigin: true },
            },
          },
        }
      : {}),
  }
})
