let application = null;

module.exports = {
    setApp: (app) => {
        application = app;
    },

    app: () => {
        return application;
    },

    isServer: () => {
        return !(typeof window !== 'undefined' && window.document);
    },

    isClient: () => {
        return (typeof window !== 'undefined' && window.document);
    }
};
