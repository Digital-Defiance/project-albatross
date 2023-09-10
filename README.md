# Project Albatross

This helper will take you through the generation of an NX monorepo with a React frontend that uses Auth0 for authentication, a Node backend, and set up a devcontainer with a Mongo database.

First, prerequisites:

* Node installed
  * [Node.js (nodejs.org)](https://nodejs.org/en)
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
? Welcome to Project Albatross, a typescript NX/React/Auth0/Node/Mongo Application generator.

This helper will take you through the generation of an NX monorepo with a React frontend that uses Auth0 for authentication, a Node backend, and set up a 
devcontainer with a Mongo database.

Press enter to continue.
? What would you like to name your project?

This will be the base application name and will be used to generate the project folder.

We will generate an NX monorepo with this name (which we will lowercase and hyphenate), and then we will generate a node application {your-project-name}-api, a react
 application {your-project-name}-react, and a library {your-project-name}-lib.

Project name should be the title of the project, begin with a letter and be alphanumeric with no special characters. Albatross One
? Where would you like to create your project?

Provide the path where the project should be created. The default is the current directory.

We will be running nx new and having it create a monorepo in this directory called albatross-one C:\Users\JessicaMulein\source\repos\
? Enable SSL? No
Checking Node version
Executing node -v
v16.20.0

Checking NX version
Executing nx --version
Nx Version:
- Local: Not found
- Global: v16.7.1

Checking Yarn version
Executing yarn -v
1.22.19

Creating NX Monorepo
... operations commence ...

```

![image-20230910141056284](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20230910141056284.png)

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
Writing C:\Users\JessicaMulein\source\repos\albatross-one\albatross-one-react\src\main.tsx
Setting up react templates
Writing C:\Users\JessicaMulein\source\repos\albatross-one\.devcontainer\.env
Writing C:\Users\JessicaMulein\source\repos\albatross-one\.devcontainer\.env.example
Writing C:\Users\JessicaMulein\source\repos\albatross-one\.devcontainer\devcontainer.json
Writing C:\Users\JessicaMulein\source\repos\albatross-one\.devcontainer\docker-compose.yml
Your project has been set up at: C:\Users\JessicaMulein\source\repos\
Don't forget to look over the .env files in the API and .devcontainer folders, then open your new project in VS Code and reopen in the devcontainer.
Done in 481.99s.
```

![image-20230910141448892](C:\Users\JessicaMulein\AppData\Roaming\Typora\typora-user-images\image-20230910141448892.png)
