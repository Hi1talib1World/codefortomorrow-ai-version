import { createServer } from 'vite';

async function start() {
    const server = await createServer({
        configFile: false,
        plugins: [
            (await import('@vitejs/plugin-react')).default(),
            (await import('@tailwindcss/vite')).default(),
        ],
        server: {
            port: 3000,
            host: '0.0.0.0',
        }
    });

    await server.listen();
    server.printUrls();
}

start();
