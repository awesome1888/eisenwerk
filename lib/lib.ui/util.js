// import qs from 'query-string';

/**
 * Auxiliary class, put all general helpers here. Feel free to make a scrap-yard here.
 */
export default class UI {

    // static findClosestParent(node, selector) {
    //     let depth = 0;
    //     while (node && depth < 50) {
    //         if ($(node).is(selector)) {
    //             return node;
    //         }
    //         node = node.parentElement;
    //         depth += 1;
    //     }
    //
    //     return null;
    // }

    // static parseUrl(url = '') {
    //     if (!url) {
    //         url = window.location.search;
    //     }
    //     return qs.parse(url);
    // }

    static loadJs(src) {
        const d = document;

        if (!d || !src) {
            return null;
        }

        src = src.toString().trim();

        this._loadedJs = this._loadedJs || {};

        if (this._loadedJs[src]) {
            return new Promise((resolve) => {
                resolve();
            });
        }

        const node = d.createElement('script');
        const p = new Promise((resolve) => {
            node.addEventListener('load', () => {
                this._loadedJs[src] = true;
                resolve();
            }, false);
        });

        node.type = 'text/javascript';
        node.setAttribute('async', 'async');
        node.setAttribute('defer', 'defer');
        node.src = src;

        const ctx = d.getElementsByTagName('head')[0] || d.body || d.documentElement;
        ctx.appendChild(node);

        return p;
    }

    static isMobile() {
        return /Mobi/.test(navigator && navigator.userAgent);
    }
}
