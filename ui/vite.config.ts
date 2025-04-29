import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  // Removed resolve.alias configuration
  server: {
    host: true, // This is equivalent to --host
    allowedHosts: [
      "5173-iymk504ffptg43h8jxew1-eeed0c3b.manus.computer"
    ]
  }
})

