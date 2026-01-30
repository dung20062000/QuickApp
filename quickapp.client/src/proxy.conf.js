// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7085';

const PROXY_CONFIG = [
  {
    context: [
      "/api",
      "/swagger",
      "/connect",
      "/oauth",
      "/.well-known"
    ],
    target,
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    // Thêm để ưu tiên IPv4
    agent: new (require('https').Agent)({
      family: 4 // Force IPv4
    }),
    // Xử lý lỗi kết nối
    onError: (err, req, res) => {
      console.error('Proxy Error:', err.message);
      console.log('Make sure your backend server is running on', target);
      res.writeHead(503, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({
        error: 'Backend server is not running',
        message: `Cannot connect to ${target}. Please start the backend server first.`,
        details: err.message
      }));
    }
  }
]

module.exports = PROXY_CONFIG;
