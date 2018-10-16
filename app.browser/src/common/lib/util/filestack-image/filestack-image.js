import url from 'url';

export default class FielStackImage {
    static getUrlResized(image, size = 200) {
        if (image) {
            const FILESTACKURL = url.parse(image);
            const picID = FILESTACKURL.pathname.split('/')[FILESTACKURL.pathname.split('/').length - 1];
            return `${FILESTACKURL.protocol}//${FILESTACKURL.host}/resize=w:${size}/compress/${picID}`;
        }
        return undefined;
    }
}
