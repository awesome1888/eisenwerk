## Scripts

To start the composition:
~~~
./run/start
~~~

To shutdown the composition, press `Ctrl(Cmd)+C` or type:
~~~
./run/halt
~~~

To see the log of one specific application:
~~~
./run/log <app-name>
~~~

To see all docker containers running, real-time:
~~~
./run/ps
~~~

To inspect a bundle of the specific application:
~~~
./run/inspect-bundle <app-name>
~~~

To clean up all caches and temporary data:
~~~
./run/cleanup
~~~

To connect to a running container:
~~~
./run/dssh <app-name>
~~~

## Todo

1) [DONE] volumes, browsersync
1.5) [DONE] scripts
1.6) [DONE] code splitting
1.61) [DONE] correct public path
1.62) use relative to source root paths
1.7) ssr
    0) execute application's init action
    1) catch the moment when the data is loaded, asynchroniously, with the timeout
    2) implement router server-side, forward route data to dispatch()
    3) the same for the client-side
    4) make reducer fabric
    5) make saga fabric
    6) implement setting and getting of the title, description and other stuff
    7) bug: ssr will work on missing 404 (i.e. favicon.ico)
    8) [DONE] memory leak in saga?!!!
        https://github.com/redux-saga/redux-saga/issues/13#issuecomment-182883680
    9) implement at least simple cache with redis
        make it decoupled: with hooks
    10) 404 with code when doing SSR
    11) disable overlay for SSR
    12) enable SSR by user agent
        https://support.google.com/webmasters/answer/80553
        https://support.google.com/webmasters/answer/1061943?hl=en
1.71) 404 with code when doing CSR
1.8) EHHH Shitty decisions made... 
    Re-think the whole idea about how we dockerize: there is a simpler way to do that with no docker-build-tool involved
    Run as dockerized or not: should not be important
2) auth in a modern way
4) re-think oauth2
5) migrations
6) manifest
7) favicon
8) webicon
9) sitemap
10) react strict mode
11) react error boundary
13) jest
14) redis 4 sessions
15) redis 4 intercomm
16) npm WARN deprecated feathers-errors@2.9.2: Feathers v3 is out and has moved to @feathersjs/errors. See https://docs.feathersjs.com/migrating.html for more information.
17) [DONE] separate class for templating
18) Couldn't open browser (if you are using BrowserSync in a headless environment, you might want to set the open option to false)]

### Random
* [CANCEL] connect to the database on-demand
* [DONE] optimize build tool pipelines and docker images
* pack everything that is possible to npm
* port useful things from pr-legacy project
    * global events
    * page scroll
        * data-store-scroll attribute and logic
    * backurl
    * set title
    * notifications
* [CANCEL] probably replace filter, sort, limit, etc with $filter, $sort, $limit, ...
* implement smart population
* [DONE] ENV dot notation
* [DONE] real data and normalized data
* [CANCEL] cron (cancelled, because for cron there should be a separate app according to the microservices architecture)
* [CANCEL] Web sockets!
* try to use component-template approach
* [DONE] make global __DEV__ constant, this will be easier to utilize
* rebuild Settings with deep freeze
* use https://www.npmjs.com/package/compression
* instead of doing `props.something`, do de-composition as `({className, children}) => { return (<div className={className}>{children}</div>) };`
* https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source

To NPM:
Put everything to @eisenwerk/*, like @eisenwerk/ui.page-scroll

* selectbox
* drag n drop
* scrollpane
* modal
* button loader
* page scroll
* csv client side generator
* csv server side generator
* build tool
    local_build-tool
* page up button
* scrollbars
* notifications
* top menu with mobile support
* file uploader
* image viewer
* enum fabric
* migrations
    f_migration
* decouple and port global event manager (without jquery)

Create "rem-bem-scss" package, port all really useful things from rem-bem, and besides:
* make useful rb-content-** alignment classes
* [DONE] make useful rb-icon-label already!
* [CANCEL] generate all mixins over all google icons, for sake
* [DONE] _rb-bg-cover(): allow to pass an image as an argument
* generate all mixins and classes for margins and paddings
* put the MIT license inside the file with color codes:
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Effects

1) overlay on different layout change (i.e. login -> main or visa versa)
2) on route change (or any load data action?) we show a progressbar
3) if load data takes too long - show some good animated SVG loader, but not instantly to avoid flicking
4) after the page is ready, we show the content not instantly, but with animation (different, see tech insightes for animation notes)


https://github.com/mzgoddard/hard-source-webpack-plugin/pull/444
