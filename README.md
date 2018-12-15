## Scripts

To start the composition:

```
./run/start
```

To shutdown the composition, press `Ctrl(Cmd)+C` or type:

```
./run/halt
```

To see the log of one specific application:

```
./run/log <app-name>
```

To see all docker containers running, real-time:

```
./run/ps
```

To inspect a bundle of the specific application:

```
./run/inspect-bundle <app-name>
```

To clean up all caches and temporary data:

```
./run/cleanup
```

To connect to a running container:

```
./run/dssh <app-name>
```

## Todo

1. [DONE] volumes, browsersync
1.5) [DONE] scripts
1.6) [DONE] code splitting
1.61) [DONE] correct public path
1.62) [CANCEL] use relative to source root paths
1.7) ssr 0) [DONE] execute application's init action 1) [DONE] catch the moment when the data is loaded, asynchroniously, with the timeout 2) [DONE] implement router server-side, forward route data to dispatch() 3) [DONE] the same for the client-side 4) [CANCEL] make page reducer fabric 5) [CANCEL] make page saga fabric 6) [DONE] implement setting and getting of the title, description and other stuff
6.0) [DONE] "Page" HOC?
6.1) [DONE] server
6.2) [DONE] client 7) http codes
[DONE] make "enter" and "leave" actions
[DONE] make "setHTTPCode" and "unsetHTTPCode" actions
[DONE] server-side load process got broken
[DONE] when SSR, check store for the http code other than 200 or undefined
[DONE] Error handling
    1) [DONE] 404
        1) CSR: [DONE] redirect to /404 client-side and on the server set status either to 200 or to 404
        2) SSR: [DONE] redirect to /404 page and set status to 404
    2) 403
        1) [DONE] CSR:
            We need redirect calculation support client-side, then we decide what to do next
        2) [DONE] SSR:
            We need redirect caclulation support server-side in order to be able to send 301, then we decide what to do next
    3) [DONE] 500
        0) [DONE] Both:
            1) [DONE] In saga we check for the error code, if it is ordinal, we set is as a httpCode, otherwise we set the code to 500
            2) [DONE] When the page receives this.props.error as 500, it shows "sorry screen" instead of it's body. the same about the application
            3) [DONE] Additionally, in application we use error boundary, which does the same as 2)
            4) [DONE] For development, we also call console.error()
        2) [DONE] SSR:
            1) [DONE] error happened inside the UI app, see 0)
            2) [DONE] otherwise:
                1) [DONE] production: set status to 500 and instead of the app layout show "sorry screen"
                2) [DONE] development: set status to 500 and res.send() error trace
7.04) [CANCEL] I don't like our render() function in Renderer, and also componentDidMount(){ load() }, move the logic partially inside the app saga, also implement sub-reducers and sub-sags of pages relative to the app 
7.045) [DONE] do something about the fuckup when you can receive data in time, also teardown the app on possible error
7.05) [DONE] Refactor
    1) [CANCEL] simplify watcher in saga
    2) [DONE] DONE -> READY
    3) [DONE] REQUEST_END(SUCCESS|FAILURE) => SUCCESS|FAILURE
    4) [CANCEL] saga fabric
7.1) [DONE] bug: ssr will work on missing 404 (i.e. favicon.ico)
7.2) [DONE] client-side 404 "route" is missing
8) [DONE] memory leak in saga?!!! https://github.com/redux-saga/redux-saga/issues/13#issuecomment-182883680
9) [DONE] implement at least simple cache with redis
    [DONE] make it decoupled: with hooks
    [DONE] dont make any cache if status is not 200
11) [DONE] disable overlay for SSR
12) [DONE] enable SSR by user agent or __ssr=1
    [DONE] https://www.npmjs.com/package/spider-detector
    [DONE] https://support.google.com/webmasters/answer/80553
    [DONE] https://support.google.com/webmasters/answer/1061943?hl=en
13) [CANCEL] in outer layout replace OOP with HOC
1.9) [DONE] simplify that oop multi-level crap with Apps, use composition for sake
    * [DONE] Fix what is broken
    * [DONE] User entity should come to the Auth as a parameter, not hard-included
    * [DONE] getLoginField() and getPasswordFiled() all over the code
2.  connect auth with redux
    1. [DONE] do something with onlogout and onreautherror events
    2. check ssr again
    3. [POSTPONE] redis cache for ssr will fail when there is an authorization (but should we fix this now? google will not be able to authorize anyway)
    4. check how google oauth works
    12. redis 4 sessions
3.  re-think oauth2
4. refactor getSettings() to .get('some.variable', 'default-value');
==== NPM!!!!! ====
    lerna?
1.95) move styles to styled-components
1.955) new overlay and progressbar mechanic based on watching the store and\or EventEmitter on componentDidUpdate of page when switching from ready false -> true
    Item types:
        1) progressbar to show every time something loads
        2) on-first-load overlay, it is shown when the website loads for the first time
        3) between-layouts fade-in-out overlay, just to make transitions more smooth
        4) skeleton components
    2.1) [CANCEL] for entities remove server and client, make it isomorphic working through services
        4. [CANCEL] graphql for entities instead of REST and feathersjs?
            1. [CANCEL] what about caching?
4.  migrations (as a separate app please)
5. progressive web app:
    5.  manifest
        6.1) web worker
6.  favicon
7.  webicon
8.  sitemap
9.  [CANCEL] react strict mode
10. [DONE] react error boundary
11. jest (see article about lerna)
13. [CANCEL] redis 4 intercomm
14. npm WARN deprecated feathers-errors@2.9.2: Feathers v3 is out and has moved to @feathersjs/errors. See https://docs.feathersjs.com/migrating.html for more information.
15. [DONE] separate class for templating
16. [CANCEL] Couldn't open browser (if you are using BrowserSync in a headless environment, you might want to set the open option to false)]
18) jasonette ? :)
1.8) EHHH Shitty decisions made...
Re-think the whole idea about how we dockerize: there is a simpler way to do that with no docker-build-tool involved
Run as dockerized or not: should not be important
https://www.npmjs.com/package/nodemon-webpack-plugin

* Optional stuff
    * Redis as a bus
    * Tagged cache
    * CI

### Random

-   [CANCEL] connect to the database on-demand
-   [DONE] optimize build tool pipelines and docker images
-   pack everything that is possible to npm
-   port useful things from pr-legacy project
    -   global events (as a separate event manager)
    -   page scroll
        -   data-store-scroll attribute and logic
    -   backurl
    -   [CANCEL] set title
    -   notifications
-   [CANCEL] probably replace filter, sort, limit, etc with $filter,$sort, \$limit, ...
-   implement smart population
-   [DONE] ENV dot notation
-   [DONE] real data and normalized data
-   [CANCEL] cron (cancelled, because for cron there should be a separate app according to the microservices architecture)
-   [CANCEL] Web sockets!
-   try to use component-template approach
-   [DONE] make global **DEV** constant, this will be easier to utilize
-   [CANCEL] rebuild Settings with deep freeze
-   use https://www.npmjs.com/package/compression
-   instead of doing `props.something`, do de-composition as `({className, children}) => { return (<div className={className}>{children}</div>) };`
-   https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source

To NPM:
Put everything to @eisenwerk/\*, like @eisenwerk/ui.page-scroll

-   selectbox
-   drag n drop
-   scrollpane
-   modal
-   button loader
-   page scroll
-   [CANCEL] csv client side generator
-   [CANCEL] csv server side generator
-   [CANCEL] build tool
    [CANCEL] local_build-tool
-   page up button
-   scrollbars
-   notifications
-   top menu with mobile support
-   file uploader
-   image viewer
-   enum fabric
-   migrations
    f_migration
-   decouple and port global event manager (without jquery)

## Effects

1. overlay on different layout change (i.e. login -> main or visa versa)
2. on route change (or any load data action?) we show a progressbar
3. if load data takes too long - show some good animated SVG loader, but not instantly to avoid flicking
4. after the page is ready, we show the content not instantly, but with animation (different, see tech insightes for animation notes)

https://github.com/mzgoddard/hard-source-webpack-plugin/pull/444
