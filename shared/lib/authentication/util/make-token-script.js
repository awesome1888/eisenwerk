export default (res, token) => {
    const sanitize = str => {
        return str.replace(/[^_-a-zA-Z0-9\.]/gi, '');
    };

    const template = `
        <html>
            <head>
              <script>
                if (window.opener && window.opener.authAgent) {
                  window.opener.authAgent.emit('login', '${sanitize(token)}');
                }
                window.close();
              </script>
            </head>
            <body></body>
          </html>
    `;

    return res
        .header('Content-Type', 'text/html')
        .header('Cache-Control', 'no-cache')
        .send(template);
};
