import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: "src/dashboard-training.ts", // your web component source file
            formats: ["es"],
			fileName: "dashboard-training"
        },
        outDir: "dist", // your web component will be saved in this location
        sourcemap: true,
        rollupOptions: {
            external: [/^@umbraco/],
        },
    },
});