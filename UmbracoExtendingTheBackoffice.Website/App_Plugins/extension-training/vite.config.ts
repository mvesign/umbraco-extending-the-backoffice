import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: ["src/dashboard-training.ts", "src/icons-dictionary.ts", "src/property-editor-training.ts"],
            formats: ["es"]
        },
        outDir: "dist",
        sourcemap: true,
        rollupOptions: {
            external: [/^@umbraco/],
        },
    },
});