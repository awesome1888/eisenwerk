new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

* do oauth2 in a proper way
* connect to the database on-demand
* optimize build tool pipelines and docker images
* plug in browsersync
* pack everything that is possible to npm
* port useful things from pr-legacy project
    * template
    * global events
    * page scroll
    * data-store-scroll attribute and logic
    * backurl
    * set title
* probably replace filter, sort, limit, etc with $filter, $sort, $limit, ...
* implement smart population
* ENV dot notation
* [DONE] real data and normalized data
* cron
* migrations
* admin app
* SSR!
* Web sockets!
* manifest
* favicon
* webicon
* sitemap
* try to use component-template approach

To NPM:
Put everything to @eisenwerk/*, like @eisenwerk/build-tool, @eisenwerk/ui.page-scroll

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
* make useful rb-icon-label already!
* generate all mixins over all google icons, for sake
* _rb-bg-cover(): allow to pass an image as an argument
* generate all mixins and classes for margins and paddings
* put the MIT license inside the file with color codes:
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
