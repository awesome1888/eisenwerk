import ejs from 'ejs';
import html from './html';

const render = ({ application }) => {
    const settings = application.getSettings();

    // let services = [];
    // if (_.isArrayNotEmpty(data.services)) {
    //     services = data.services.map(s => ({
    //         path: s.getPath(),
    //         description: s.getDescription(),
    //     }));
    // }

    const methods = application.getMethods().reduce((result, m) => {
        Object.keys(m.getDeclaration()).forEach(item => {
            result.push(item);
        });
        return result;
    }, []);

    return ejs.render(html, {
        production: settings.isProduction(),
        services: application.getServices(),
        methods,
        settings,
    });
};
export default render;
