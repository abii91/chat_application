# Admin panel front-end framework For Monsanto
<br />

### Project Structure
```
├── bower.json               <- front-end library dependencies
├── gulpfile.js              <- main task runner file
├── package.json             <- mostly task runner dependencies
├── docs/                    <- wintersmith documentation generator
├── gulp/                    <- build tasks
├── src/                     <- main front-end assets
│   ├── 404.html
│   ├── auth.html
│   ├── index.html          <- main app dashboard page
│   ├── reg.html
│   ├── app/                <- angular application files
│   │   ├── app.js         <- angular application entry point. Used for managing dependencies
│   │   ├── pages/         <- UI router pages. Pages created for demonstration purposes. Put your application js and html files here
│   │   ├── theme/         <- theme components. Contains various common widgets, panels which used across application
│   ├── assets/             <- static files (images, fonts etc.)
│   ├── sass/               <- sass styles
│   │   ├── app/           <- application styles. Used mostly for demonstration purposes. Put your app styles here.
│   │   ├── theme/         <- theme styles. Used to customize bootstrap and other common components used in tempate.
```
<br />

### Create New Page

0) Let’s assume we want to create a blank page with title ‘My New Page’

1) Let’s Create a new directory to contain our new page inside of src/app/pages. Let’s call this directory myNewPage.

2) Then let’s create blank angular module to contain our page called ‘myNewPage.module.js’ inside of src/app/pages/myNewPage:

```
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.myNewPage', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig() {

  }

})();
```

3) Then let’s create empty html file called my-new-page.html inside of src/app/pages/myNewPage.

4) Lastly let’s create ui router state for this page. To do this we need to modify module.js file we created on step 2:

```
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.myNewPage', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('myNewPage', {
          url: '/myNewPage',
          templateUrl: 'app/pages/myNewPage/my-new-page.html',
          title: 'My New Page',
          sidebarMeta: {
            order: 800,
          },
        });
  }

})();
```
