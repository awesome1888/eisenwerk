export const makeStatus = e => {
    if (e) {
        const status = parseInt(e.message, 10);
        if (status.toString() === e.message) {
            return status;
        } else {
            return 500;
        }
    }

    return null;
};
