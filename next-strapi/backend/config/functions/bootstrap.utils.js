module.exports = {
    createEntry: async function ({ model, entry, files }) {
        try {
            const createdEntry = await strapi.query(model).create(entry);
            if (files) {
                await strapi.entityService.uploadFiles(createdEntry, files, {
                    model,
                });
            }
        } catch (e) {
            console.log('model', entry, e);
        }
    }
}