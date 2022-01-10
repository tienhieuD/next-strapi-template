"use strict";

const { createEntry, getFileData, setPublicPermissions, isFirstRun } = require("./bootstrap/utils");
const { global } = require("../../data/data.json");


async function importGlobal() {
    const files = {
        "favicon": getFileData("favicon.png"),
        "defaultSeo.metaImage": getFileData("default-image.png"),
    };
    return createEntry({ model: "global", entry: global, files });
}

async function importSeedData() {
    // Create all entries
    await importGlobal();
}

async function configPublicPermisson() {
    // Allow read of application content types
    await setPublicPermissions({
        global: ['find'],
    });
}

// async function configView() {
//     const pluginStore = await strapi.store({
//         environment: '',
//         type: 'plugin',
//         name: 'content_manager',
//     });
//     let key = "configuration_content_types::application::global.global"
//     let data = await pluginStore.get({ key });
//     data = { ...data, ...require("../../views/global.json") };
//     return pluginStore.set({ key, value: data });
// }

module.exports = async () => {
    strapi.log.info('Bootstrap running...');
    const shouldImportSeedData = await isFirstRun();

    if (shouldImportSeedData) {
        try {
            strapi.log.info('Setting up the template...');
            await importSeedData();
            strapi.log.info('Ready to go');
        } catch (error) {
            strapi.log.info('Could not import seed data');
            strapi.log.error(error);
        }
    }

    strapi.log.info('Setting up the public permisson...');
    await configPublicPermisson()
};
