export default class Oauth2Failure {
    static attach(app) {
        app.use('/auth/google/callback', (error, req, res, next) => {
            res.status(error.code ? error.code : 500);
            res.send(`
<script>
window.close();
</script>
            `);
        });
    }
}
