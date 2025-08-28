// Build script to inject environment variables into the client
const fs = require('fs');
const path = require('path');

// Get environment variables from Vercel
const authUsername = process.env.AUTH_USERNAME || 'demo_user';
const authPassword = process.env.AUTH_PASSWORD || 'demo_pass';

console.log('🔧 Building with environment variables...');
console.log(`✅ Username configured: ${authUsername}`);
console.log(`✅ Password configured: ${'*'.repeat(authPassword.length)}`);

// Create environment variables script
const envScript = `
// Environment variables injected at build time
window.ENV = {
    AUTH_USERNAME: '${authUsername.replace(/'/g, "\\'")}',
    AUTH_PASSWORD: '${authPassword.replace(/'/g, "\\'")}'
};
console.log('🔐 Environment variables loaded');
`;

// Write the environment script
fs.writeFileSync(path.join(__dirname, 'env.js'), envScript);

console.log('✅ Environment variables injected successfully');