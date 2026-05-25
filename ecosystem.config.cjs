module.exports = {
  apps: [
    {
      name: 'code-for-tomorrow',
      script: './node_modules/jiti/bin/jiti.js',
      args: 'server.ts',
      instances: 'max',          // Cluster across all CPU cores to distribute load
      exec_mode: 'cluster',      // Run in Node cluster mode
      autorestart: true,         // Auto-restart if server crashes
      watch: false,              // Disable watching in production
      max_memory_restart: '1G',  // Restart if process memory exceeds 1GB
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
