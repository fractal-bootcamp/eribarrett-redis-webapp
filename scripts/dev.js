const { spawn } = require('child_process');
const path = require('path');
const chokidar = require('chokidar');

// Start backend development server
const backendServer = spawn('nodemon', ['--exec', 'ts-node', '--project', 'tsconfig.json', 'src/server.ts'], {
    stdio: 'inherit',
    shell: true
});

// Watch frontend TypeScript files and rebuild on change
const frontendWatcher = chokidar.watch('src/frontend/**/*.ts', {
    ignored: /(^|[\/\\])\../,
    persistent: true
});

console.log('Watching frontend TypeScript files...');

frontendWatcher.on('change', path => {
    console.log(`File ${path} has been changed, rebuilding frontend...`);
    const buildProcess = spawn('node', ['scripts/build-frontend.js'], {
        stdio: 'inherit',
        shell: true
    });

    buildProcess.on('close', code => {
        if (code === 0) {
            console.log('Frontend rebuild complete');
        } else {
            console.error(`Frontend build failed with code ${code}`);
        }
    });
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\nStopping development servers...');
    backendServer.kill();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\nStopping development servers...');
    backendServer.kill();
    process.exit(0);
});

// Initial frontend build
console.log('Building frontend for the first time...');
const initialBuild = spawn('node', ['scripts/build-frontend.js'], {
    stdio: 'inherit',
    shell: true
});

console.log('\nDevelopment server is running!');
console.log('- Backend: http://localhost:3000');
console.log('- Frontend watching for changes');
console.log('Press Ctrl+C to stop')