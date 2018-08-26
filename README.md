# Eisenwerk - MERN boilerplate

## Pre-requisites:
* node v8 or higher
* npm
* gulp-cli
* docker
* docker-compose

or a virtual machine with everything mentioned above on-board.

## Commands

### To start the orchestration described in `docker/all.development.yml`, type
~~~~
./script/start/all.sh;
~~~~
To exit, press, `CTRL+C`.

To start only `app` or only `admin`, type respectively:
~~~~
./script/start/app.sh;
./script/start/admin.sh;
~~~~

### To view all containers running real-time, type
~~~~
./script/ps.sh;
~~~~

### To analyze the produced bundle (typically, a client bundle), type
~~~~
./script/analyse-bundle.sh CONTAINER_NAME:BUILD_TASK_CODE
~~~~
Example: 
~~~~
./script/analyse-bundle.sh ew.dev.desktop:client
~~~~
This will install the package `webpack-bundle-analyzer` globally, so beware.
Also, before making the analysis, you need to turn on the debug in the `gulp.js` like this:
~~~~
getTaskSchema() {
    const rootFolder = this.getRootFolder();
    return [
        ...
        {
            code: 'client',
            watch: [`${rootFolder}/client/src/**/*`],
            build: this.buildClient.bind(this),
            folder: `${rootFolder}/client/`,
            debugBundle: true, // <<<<<<<<<<<<<<<<
        },
    ];
}
~~~~
and re-run the build.

### To follow the logfile of the container, type
~~~~
./script/log.sh CONTAINER_NAME
~~~~
Example: 
~~~~
./script/log.sh ew.dev.desktop
~~~~

### To wipe out the build cache, type
~~~~
./script/clear-cache.sh
~~~~

## JS API

In order to work with an entity, import it.
Client-side:
~~~~
import Company from './common/entity/company/entity/client.js;
~~~~
Server-side:
~~~~
import Company from './common/entity/company/entity/server.js;
~~~~

### To find entities there are several ways:

* direct search:
~~~~
const result = await Company.find({filter: {...}, sort: {...}, select: {...}, limit: 1, offset: 5, populate: {...}})
~~~~

* simple query
~~~~
const query = Company.query({filter: {...}, sort: {...}, select: {...}, limit: 1, offset: 5, populate: {...}});
const result = await query.exec();
~~~~

* fabric-based query
~~~~
const query = Company.query((parameters, query) => {
    if (_.isNumber(parameters.itemLimit)) {
        query.limit(parameters.itemLimit);
    }

    query.select({employers: 1, details: 1, createdAt: 1});
    query.sort({createdAt: -1});
    query.populate(['employers']);
});

query.setParameters({
    itemLimit: 3,
});

const result = await query.exec();
~~~~

The query can be re-used:
~~~~
const newQuery = query.clone({...parameters});
~~~~
or
~~~~
query.setParameters({...parameters});
~~~~

### To get one item:
~~~~
const item = await Company.get('5b604a878e31fe0015219115');
~~~~

### To create/update an item:
~~~~
const item = new Company();
item.getData().details = {name: 'Blah'};

const result = await item.save();
if (result.isOk()) {
    console.dir(item.getId());
} else {
    console.dir(result.getErrors());
}
~~~~

There is also a static version available:
~~~~
const result = await Company.save('5b6312293fd70b000f10f687', {details: {name: 'New name'}});
if (result.isOk()) {
    console.dir(result.getData());
} else {
    console.dir(result.getErrors());
}
~~~~
This version is preferable if you just need one field to be changed.

### To remove an item
~~~~
const result = await item.delete();
if (result.isOk()) {
    console.dir(item.getId()); // should be undefined
} else {
    console.dir(result.getErrors());
}
~~~~

There is also a static version available:
~~~~
const result = await Company.delete('5b6312293fd70b000f10f687');
if (result.isOk()) {
    console.dir(result.getData());
} else {
    console.dir(result.getErrors());
}
~~~~

### To remove many items by a condition
~~~~
await Company.deleteMany({...conditions});
~~~~

## Access rules explained

We can apply access rules currently in 4 places:
1) service method access (get, find, create, update, put, delete), server-side
2) route access, client side
3) custom method access, server side
4) custom server-side route access (coming soon)

Typical access declaration is:
~~~~
{
    deny: false,
    authorized: true,
    roleAll: [roleEnum.ADMINISTRATOR, roleEnum.CANDIDATE],
    roleAny: [roleEnum.ADMINISTRATOR, roleEnum.EMPLOYER],
    custom: (user, context) => {
        ... some checks ...
        return true/false;
    },
}
~~~~

Rules are checked in order they are shown in the example above, from `deny` to `custom` 

1) `deny` must be switched to `false` in order to enable the feature,
2) `authorized` set to `true` means the valid auth token should be passed along the request,
3) `roleAll` means that all roles specified in the array should be present in the passed user`s profile,
4) `roleAll` means that any of the roles specified in the array should be present in the passed user`s profile,
5) `custom` rule should be a function and should provide some custom user checks. It should return boolean or throw an exception.

