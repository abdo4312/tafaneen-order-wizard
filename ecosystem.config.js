export default {
  apps: [{
    name: 'vite-dev',
    script: 'npx',
    args: 'vite --host 0.0.0.0 --port 5173',
    cwd: '/home/user/webapp',
    env: {
      NODE_ENV: 'development'
    },
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    log_file: '/home/user/webapp/vite-dev.log',
    error_file: '/home/user/webapp/vite-dev-error.log',
    out_file: '/home/user/webapp/vite-dev-out.log'
  }]
};