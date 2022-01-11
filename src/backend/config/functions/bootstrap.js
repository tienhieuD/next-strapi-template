"use strict";

const {
    createEntry,
    getFileData,
    setPublicPermissions,
    isFirstRun,
    configView
} = require("./bootstrap/utils");


async function importGlobal() {
    await createEntry({
        model: "global", entry: require("../../data/data.json").global, files: {
            "favicon": getFileData("favicon.png"),
            "defaultSeo.metaImage": getFileData("default-image.png"),
        }
    });
}

async function importSeedData() {
    await importGlobal();
}

async function configPublicPermisson() {
    await setPublicPermissions({
        global: ['find'],
    });
}

async function configViews() {
    await configView("configuration_content_types::application::global.global", require("../../views/global.json"))
    await configView("configuration_components::shared.seo", require("../../views/shared.seo.json"))
    await configView("configuration_components::shared.meta", require("../../views/shared.meta.json"))
}

module.exports = async () => {
    strapi.log.info('Bootstrap running...');
    const shouldImportSeedData = await isFirstRun();

    if (shouldImportSeedData) {
        try {
            strapi.log.info('Setting up the seed data...');
            await importSeedData();
        } catch (error) {
            strapi.log.info('Could not import seed data');
            strapi.log.error(error);
        }
    }

    strapi.log.info('Setting up the public permisson...');
    await configPublicPermisson()

    strapi.log.info('Setting the admin layout...');
    await configViews()

    return strapi.log.info('Ready to go');
};
