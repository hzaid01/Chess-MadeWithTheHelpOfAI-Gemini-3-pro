import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.resolve(__dirname, '../dist/index.html');
const dest = path.resolve(__dirname, '../dist/404.html');

try {
    fs.copyFileSync(src, dest);
    console.log('Successfully copied dist/index.html to dist/404.html');
} catch (err) {
    console.error('Error copying 404.html:', err);
    process.exit(1);
}
