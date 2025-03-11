const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Ensure public/js directory exists
const jsDir = path.join(__dirname, '../public/js');
if (!fs.existsSync(jsDir)) {
    fs.mkdirSync(jsDir, { recursive: true });
}

// Compile frontend TypeScript
console.log('Compiling frontend TypeScript...');
exec('npx tsc --project tsconfig.frontend.json', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error compiling frontend TypeScript: ${error}`);
        return;
    }

    if (stderr) {
        console.error(`TypeScript compilation stderr: ${stderr}`);
    }

    console.log('Frontend TypeScript compiled successfully');
});