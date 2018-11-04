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
1.6) code splitting
1.7) ssr
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

Create "rem-bem-scss" package, port all really useful things from rem-bem, and besides:
* make useful rb-content-** alignment classes
* [DONE] make useful rb-icon-label already!
* [CANCEL] generate all mixins over all google icons, for sake
* [DONE] _rb-bg-cover(): allow to pass an image as an argument
* generate all mixins and classes for margins and paddings
* put the MIT license inside the file with color codes:
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
