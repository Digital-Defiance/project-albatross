# Project Albatross

This helper will take you through the generation of an NX monorepo with a React frontend that uses Auth0 for authentication, a Node backend, and set up a devcontainer with a Mongo database.

First, prerequisites:

* Node installed
  * [Node.js (nodejs.org)](https://nodejs.org/en) >= Node 18
* yarn installed globally
  * npm install -g yarn
* nx installed globally
  * yarn global add nx@latest
* openssl installed if you want to set up SSL for your project
  * On windows this may be installed with Git for Windows
  * [Git - Downloads (git-scm.com)](https://git-scm.com/downloads)

You can run it with ```yarn build:run``` from the project directory.

It will prompt you for the basics, then set up the project folders and follow up with some more questions as it walks you through creating the tenant and settings in Auth0.

```
$ yarn build:run
yarn run v1.22.19
$ tsc && node dist/main.js
```

![image-20231016155347690](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016155347690.png)

Press enter to continue.

At the next prompt, type the name of your project- our example is called "Albatross One"

![image-20231016155444410](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016155444410.png)

Next, input where you'd like the project to be created underneath

![image-20231016155548887](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016155548887.png)

Next, choose your MongoDB database name, username, and password. If you accept the default, hidden password, a random password will be placed into the appropriate .env files and will be visible to you there after the project is created.

![image-20231016155645498](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016155645498.png)

Next, choose whether you want SSL or not. If you do, you must have openssl installed and be prepared to follow the prompts. In our case, we chose not to enable SSL.
![image-20231016155817404](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016155817404.png)

After SSL options are decided or skipped, Project Albatross will run the initial project generation steps for you and being creating your application in the directory you specified above.

![image-20231016160009920](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016160009920.png)

This will continue for several minutes. When it completes, it will begin prompting us for Auth0 Configuration.

![image-20231016160344851](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016160344851.png)

In the Auth0 dashboard, create your first tenant

![image-20231016160602145](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016160602145.png)

Now delete the default application and create a new SPA application.
From it's Settings page, input the domain shown
![image-20231016161040881](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016161040881.png)

![image-20231016161149930](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016161149930.png)

On the next prompt, input the client ID shown below the domain:

![image-20231016161256563](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016161256563.png)

Next, set the callback, logout, origin, and CORS URLs in the settings of the SPA application in the Auth0 dashboard

![image-20231016161611855](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016161611855.png)

![image-20231016161736315](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016161736315.png)

Follow the provided link in the console similar to the one below and create a new API as instructed.

```
Now create a new API via https://manage.auth0.com/dashboard/us/albatross-one/apis.
Be sure the identifier is set to 'http://localhost:3000/' (trailing slash is important) and signing algorithm is RS256
Now, under its settings, enable RBAC, and "Add permissions in the access token" and click save.
Under Permissions for the new API, add "create:users"
Then go into the settings for the default "Auth0 Management API" under Machine to Machine Applications and enable your new API.
Under the settings for the default API, in the Machine to Machine Applications tab, enable the new API labeled (Test Application).
Drop down the arrow at the right and in the permissions that are revealed, click select all, and then click update.
```


![image-20231016161820403](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016161820403.png)

![image-20231016162014226](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016162014226.png)

Click Create API and then fill in the details

![image-20231016162053601](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016162053601.png)

In the new API, enable RBAC and "Add permissions in the Access Token".

![image-20231016162140648](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016162140648.png) 

![image-20231016161523739](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016161523739.png)

Under the default API (Auth0 Management API), under Machine to Machine Applications, enable the new (Test Application) and select all permissions and then click update. 

![image-20231016154701624](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016154701624.png)

In the new API,

![image-20231016154842738](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016154842738.png)

Under Machine to Machine Applications, enable the new permissions
![image-20231016154939329](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231016154939329.png)

![image-20231017162209146](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20231017162209146.png)

```
Auth0 Configuration
? First, log into auth0 via https://auth0.com/api/auth/login?redirectTo=dashboard, and create a tenant.
Input its domain here. It should look like something like 'albatross-one.us.auth0.com' albatross-one.us.auth0.com
? Now delete the default auth0 application, and create a new SPA application.
What is the Client ID for the SPA application? Wk1fItBwJ8iITux0OveSNtp37GlPjO3q

In the settings for your client application, be sure to set:
  - Allowed Callback URLs to "http://localhost:3000/callback"
  - Allowed Logout URLs to "http://localhost:3000/
  - Allowed Web Origins to "http://localhost:3000/
  - Allowed Origins (CORS) to "http://localhost:3000/

Now create a new API via https://manage.auth0.com/dashboard/us/albatross-one/apis.
Be sure the identifier is set to 'http://localhost:3000/' (trailing slash is important) and signing algorithm is RS256
Now, under its settings, enable RBAC, and "Add permissions in the access token" and click save.
Under Permissions for the new API, add "create:users"
Then go into the settings for the default "Auth0 Management API" under Machine to Machine Applications and enable your new API.
Under the settings for the default API, in the Machine to Machine Applications tab, enable the new API labeled (Test Application).
Drop down the arrow at the right and in the permissions that are revealed, click select all, and then click update.

? The previous step creating the API should have created a new Machine to Machine application.
Under its Settings, what is its Client ID? TMxsI0OfdTRQzVZ87ScK02hZTNqxRs2x
? What is the Client Secret? [hidden]

Under Authentication > Social via https://manage.auth0.com/dashboard/us/albatross-one/connections/social, feel free to delete the Google connector       
Under Actions > Flows via https://manage.auth0.com/dashboard/us/albatross-one/actions/flows, create a new custom Login flow called "Email Verification" with the following:

exports.onExecutePostLogin = async (event, api) => {
  if (!event.user.email_verified) {
    api.access.deny('Please verify your email before logging in.');
  }
}
Add the new Action to the Login flow
Create another flow called "Add RBAC Roles" with the following:

exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://albatross-one.us.auth0.com/';

  // Check if the user has roles in app_metadata or user_metadata
  let roles = [];
  if (event.user.app_metadata && event.user.app_metadata.roles) {
    roles = event.user.app_metadata.roles;
  } else if (event.user.user_metadata && event.user.user_metadata.roles) {
    roles = event.user.user_metadata.roles;
  }
  console.log(event.user.app_metadata.roles);
  console.log(event.user.user_metadata.roles);
  console.log(roles);

  // Append roles to the ID and/or Access Token
  api.idToken.setCustomClaim(namespace + 'roles', roles);
  api.accessToken.setCustomClaim(namespace + 'roles', roles);
};
Add the new Action to the Login flow after the Email Verification action
Auth0 should be configured and good to go at this point

Setting up lib templates
Deleting the default lib directory
Beginning templating for lib
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\enumerations\modelName.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\enumerations\modelNameCollection.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\interfaces\hasCreation.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\interfaces\hasCreator.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\interfaces\hasDeleter.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\interfaces\hasId.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\interfaces\hasSoftDelete.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\interfaces\hasTimestampOwners.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\interfaces\hasTimestamps.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\interfaces\hasUpdater.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\interfaces\hasUpdates.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\interfaces\modelData.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\interfaces\schemaModelData.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\interfaces\schemaModels.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\interfaces\user.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\models\baseModel.spec.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\models\baseModel.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\schemas\user.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\index.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\schema.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-lib\src\lib\schemaModelData.ts
Setting up node templates
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\.env
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\.env.example
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\errors\baseError.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\errors\emailExists.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\errors\invalidEmail.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\errors\invalidPassword.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\errors\usernameExists.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\interfaces\environment.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\middlewares\auth0.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\middlewares\error.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\middlewares\not-found.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\routes\api.route.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\routes\users.route.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\services\jwtService.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\services\userService.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\auth0.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\cors.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\environment.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\main.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\setupDatabase.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\setupMiddlewares.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\setupRoutes.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-api\src\setupStaticReactApp.ts
Setting up react templates
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\app\app.tsx
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\components\api-access.tsx
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\components\authentication-required.tsx
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\components\callback.tsx
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\components\login-button.tsx
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\components\login-link.scss
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\components\login-link.tsx
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\components\logout-link.scss
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\components\logout-link.tsx
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\components\not-found.tsx
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\components\page-loader.tsx
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\environments\environment.prod.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\environments\environment.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\interfaces\environment.ts
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\pages\account-error.tsx
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\pages\user-profile.tsx
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\pages\register.tsx
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\main.tsx
Setting up react templates
Writing C:\Users\JessicaMulein\source\repos\albatross-one\.devcontainer\.env
Writing C:\Users\JessicaMulein\source\repos\albatross-one\.devcontainer\.env.example
Writing C:\Users\JessicaMulein\source\repos\albatross-one\.devcontainer\devcontainer.json
Writing C:\Users\JessicaMulein\source\repos\albatross-one\.devcontainer\docker-compose.yml
Setting up project templates
Writing C:\Users\JessicaMulein\source\repos\albatross-one\.eslintrc.json
Writing C:\Users\JessicaMulein\source\repos\albatross-one\.gitignore
Writing C:\Users\JessicaMulein\source\repos\albatross-one\.prettierrc
Writing C:\Users\JessicaMulein\source\repos\albatross-one\auth0-flows\add-rbac-roles.js
Writing C:\Users\JessicaMulein\source\repos\albatross-one\auth0-flows\email-verification.js
Your project has been set up at: C:\Users\JessicaMulein\source\repos
Don't forget to look over the .env files in the API and .devcontainer folders, then open your new project in VS Code and reopen in the devcontainer.
Once the yarn prerequisites are installed, you cna run the project with yarn build-serve:dev
Done in 88049.19s.
```

![image-20230910141448892](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20230910141448892.png)
