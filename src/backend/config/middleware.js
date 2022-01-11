const ADMIN_URL = process.env.ADMIN_URL
const PORT = process.env.PORT

module.exports = {
    settings: {
        cors: {
            origin: [ADMIN_URL, "*"], //allow all origins
            headers: ["Content-Type", "*"], //allow all headers
        },
        cache: {
            enabled: true,
            withStrapiMiddleware: true, // A direct access to the Cache API: strapi.middleware.cache
            withKoaContext: true, // A direct access to the Cache API: ctx.middleware.cache
            max: 100000, // The maximum size of the cache, checked by applying the length function to all values in the cache. Not setting this is kind of silly, since that's the whole purpose of this lib, but it defaults to Infinity. Setting it to a non-number or negative number will throw a TypeError. Setting it to 0 makes it be Infinity.
            maxAge: 3600000, // Maximum age in ms. Items are not pro-actively pruned out as they age, but if you try to get an item that is too old, it'll drop it and return undefined instead of giving it to you. Setting this to a negative value will make everything seem old! Setting it to a non-number will throw a TypeError.
        },
    },
};