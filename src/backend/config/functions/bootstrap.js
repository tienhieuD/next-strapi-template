"use strict";

const { initDefaultLocale } = require("./bootstrap/locale");
const {
    createEntry,
    getFileData,
    setPublicPermissions,
    isFirstRun,
    configView
} = require("./bootstrap/utils");


async function importGlobal() {
    const data = require("../../data/data.json")
    await createEntry({
        model: "global", entry: data.global, files: {
            "favicon": getFileData("favicon.png"),
            "defaultSeo.metaImage": getFileData("default-image.png"),
        }
    });
}

async function importSeedData() {
    strapi.log.info('Setting up the seed data...');
    await importGlobal();
}

async function configPublicPermisson() {
    strapi.log.info('Setting up the public permisson...');
    await setPublicPermissions({
        global: ['find'],
    });
}

async function configViews() {
    strapi.log.info('Setting the admin layout...');
    await configView("configuration_content_types::application::global.global", require("../../views/global.json"))
    await configView("configuration_components::shared.seo", require("../../views/shared.seo.json"))
    await configView("configuration_components::shared.meta", require("../../views/shared.meta.json"))
}

module.exports = async () => {
    strapi.log.info('Bootstrap running...');

    await configPublicPermisson()
    await initDefaultLocale()
    await configViews()

    const shouldImportSeedData = await isFirstRun();
    if (shouldImportSeedData) {
        await importSeedData();
    }

    return strapi.log.info('Ready to go');
};
