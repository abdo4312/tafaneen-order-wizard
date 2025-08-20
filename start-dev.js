import { spawn } from 'child_process';

const vite = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5173'], {
  cwd: '/home/user/webapp',
  stdio: 'inherit',
  env: { ...process.env }
});

vite.on('error', (err) => {
  console.error('Failed to start Vite:', err);
});

vite.on('exit', (code) => {
  console.log(`Vite process exited with code ${code}`);
});