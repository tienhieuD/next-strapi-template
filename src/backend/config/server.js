module.exports = ({ env }) => {
  const SERVE_ADMIN_PANEL = env.bool("SERVE_ADMIN_PANEL", true)
  const PORT = env.int('PORT', 1337)
  const HOST = env('HOST', '0.0.0.0')

  return ({
    host: HOST,
    port: PORT,
    url: env('API_URL'),
    admin: {
      url: SERVE_ADMIN_PANEL ? '/admin' : '/',
      serveAdminPanel: SERVE_ADMIN_PANEL,
      auth: {
        secret: env('ADMIN_JWT_SECRET', '6a2998cd19ace3c6b8a983157b0f68b7'),
      },
    },
  })
};
