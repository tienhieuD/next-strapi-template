module.exports = async function registerEmailTemplate() {
    let mailTemplates = await strapi
        .store({
            environment: '',
            type: 'plugin',
            name: 'users-permissions',
            key: 'email',
        })
        .get();

    // add new mail template
    if (!mailTemplates.email_member_registration) {
        const templateMemberRegistration = {
            "email_member_registration": {
                "display": "marketing.email",
                "icon": "check-square",
                "options": {
                    "from": {
                        "name": "System",
                        "email": "no-reply@example.vn"
                    },
                    "response_email": "no-reply@example.vn",
                    "object": "this is marketing",
                    "message": `
<p>Kính gửi <%= memberName %></p>\n\n
<p>Xin cảm ơn.</p>
`
                }
            }
        }

        mailTemplates = {
            ...mailTemplates,
            ...templateMemberRegistration
        }
    }

    await strapi
        .store({
            environment: '',
            type: 'plugin',
            name: 'users-permissions',
            key: 'email',
        })
        .set({ value: mailTemplates });

    return;
};