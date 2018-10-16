/**
 * This class allows to manage the vertical scroll of the page
 */
export default class PageScroll {
    /**
     * Store page scroll value
     * @returns void
     */
    static store() {
        if (mern.isClient()) {
            const doc = document.documentElement;
            const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

            sessionStorage.setItem('whereToScroll', top);
        }
    }

    /**
     * Resets the stored value of scroll
     * @returns void
     */
    static clear() {
        sessionStorage.setItem('whereToScroll', 0);
    }

    /**
     * Scroll to the stored page scroll value
     * @returns void
     */
    static scrollToStored(speed = 0) {
        if (mern.isClient()) {
            const top = parseInt(sessionStorage.getItem('whereToScroll'), 10);
            if (!Number.isNaN(top) && top >= 0) {// eslint-disable-line
                this.scrollTo(top, speed);
                this.clear();
            }
        }
    }

    /**
     * Scroll to a specific value
     * @param {int} top
     * @param {int|string} speed
     * @returns void
     */
    static scrollTo(top = 0, speed = 0) {
        if (mern.isClient()) {
            let t = parseInt(top, 10);
            if (Number.isNaN(t) || t < 0) {// eslint-disable-line
                t = 0;
            }
            if (!Number.isNaN(speed)) {// eslint-disable-line
                $('html, body').animate({scrollTop: t}, 0);
                $('.modal').animate({scrollTop: t}, 0);
            } else {
                $('html, body').animate({scrollTop: t}, 'slow');
                $('.modal').animate({scrollTop: t}, 'slow');
            }
        }
    }
}
