import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const venvPy = path.resolve(__dirname, '../../.venv311/Scripts/python.exe');
const pythonCmd = fs.existsSync(venvPy) ? venvPy : 'python';

console.log(`Starting AI microservice with: ${pythonCmd}`);
const proc = spawn(
  pythonCmd,
  ['-m', 'uvicorn', 'main:app', '--reload', '--host', '0.0.0.0', '--port', '8000'],
  { cwd: __dirname, stdio: 'inherit', shell: false }
);

proc.on('error', (err) => {
  console.error('Failed to start AI service:', err);
});
