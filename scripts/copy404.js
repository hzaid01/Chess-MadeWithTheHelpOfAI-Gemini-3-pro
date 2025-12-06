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

    // Create .nojekyll file to prevent GitHub Pages Jekyll processing
    // This is crucial for proper asset loading on GitHub Pages
    const nojekyllPath = path.resolve(__dirname, '../dist/.nojekyll');
    fs.writeFileSync(nojekyllPath, '');
    console.log('Successfully created dist/.nojekyll');
} catch (err) {
    console.error('Error in postbuild script:', err);
    process.exit(1);
}
