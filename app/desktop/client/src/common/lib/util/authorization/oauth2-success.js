export default class Oauth2Success {
    static attach(app) {
        app.use('/auth/success', (req, res, next) => {
            res.send(`
<html>
    <head>
      <script>
        var parser = document.createElement('a');
        parser.href = window.location.href;
        var search = parser.search.replace(/^\\?/, '').split('&');
        
        var token = '';
        for (var k = 0; k < search.length; k++) {
            var pair = search[k].split('=');
            if (pair[0] === 'token') {
                token = pair[1];
            }
        }
        
        if (token && window.opener) {
          window.opener.authAgent.emit('login', token);
        }
    
        window.close();
      </script>
    </head>
    <body></body>
</html>`);
        });
    }
}
