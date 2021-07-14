module.exports = ({ env }) => ({
    email: {
        provider: 'smtp',
        providerOptions: {
            host: 'smtp.gmail.com', //SMTP Host
            port: 465, //SMTP Port
            secure: true,
            username: env("STRAPI_SMTP_USERNAME", 'xxx.xxx.xxx@gmail.com'),
            password: env("STRAPI_SMTP_PASSWORD", 'hQhq8w8bMGZgwE9'),
            rejectUnauthorized: true,
            requireTLS: true,
            connectionTimeout: 1,
        },
        settings: {
            from: env("STRAPI_SMTP_USERNAME", 'xxx.xxx.xxx@gmail.com'),
            replyTo: env("STRAPI_SMTP_USERNAME", 'xxx.xxx.xxx@gmail.com'),
        },
    },
});