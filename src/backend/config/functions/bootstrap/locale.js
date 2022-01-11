const { createEntry } = require("./utils");

async function initDefaultLocale() {
    // createEntry({ model: "locales", entry: { name: "English (en)", code: "en", } });
    // createEntry({ model: "locales", entry: { name: "Vietnamese (vi)", code: "vi", } });

    // await strapi
    //     .store({
    //         environment: '',
    //         type: 'plugin',
    //         name: 'i18n',
    //         key: 'default_locale',
    //     })
    //     .set({ value: "vi" });
    const locales = require("../../../data/locale.json")

    // Find the ID of the public role
    const defs = locales.map(async ({ name, code }) => {
        const locale = await strapi.query("locale", "i18n").findOne({ code });
        if (locale) {
            return;
        }
        return strapi
            .query("locale", "i18n")
            .create({ name, code })
    })

    defs.push(strapi.store({
        environment: '',
        type: 'plugin',
        name: 'i18n',
        key: 'default_locale',
    }).set({ value: "vi" }));

    return Promise.all(defs);


    // // List all available permissions
    // const publicPermissions = await strapi
    //     .query("permission", "users-permissions")
    //     .find({
    //         type: ["users-permissions", "application"],
    //         role: publicRole.id,
    //     });

    // // Update permission to match new config
    // const controllersToUpdate = Object.keys(newPermissions);
    // const updatePromises = publicPermissions
    //     .filter((permission) => {
    //         // Only update permissions included in newConfig
    //         if (!controllersToUpdate.includes(permission.controller)) {
    //             return false;
    //         }
    //         if (!newPermissions[permission.controller].includes(permission.action)) {
    //             return false;
    //         }
    //         return true;
    //     })
    //     .map((permission) => {
    //         // Enable the selected permissions
    //         return strapi
    //             .query("permission", "users-permissions")
    //             .update({ id: permission.id }, { enabled: true })
    //     });
    // await Promise.all(updatePromises);
};

module.exports = {
    initDefaultLocale
}