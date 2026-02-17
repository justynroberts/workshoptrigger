// MIT License - Copyright (c) fintonlabs.com
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        port: 8847,
        allowedHosts: ['oracle.local'],
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/test/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/main.tsx',
            ],
            thresholds: {
                statements: 100,
                branches: 95,
                functions: 100,
                lines: 100,
            },
        },
    },
});
