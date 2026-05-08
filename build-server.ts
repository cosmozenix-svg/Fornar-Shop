import * as esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/server.cjs',
  format: 'cjs',
  external: [
    'express', 
    'cors',
    'body-parser',
    'dotenv',
    'vite',
    'bcryptjs',
    'express-validator',
    'express-session',
    'better-sqlite3'
  ],
}).catch(() => process.exit(1));
