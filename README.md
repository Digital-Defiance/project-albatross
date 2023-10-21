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

![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/e2a128ee-fc02-456d-ab21-fb9772c98a6e)


Press enter to continue.

At the next prompt, type the name of your project- our example is called "Albatross One"

![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/74712bf1-6383-4f61-b0b9-8beab207ead0)


Next, input where you'd like the project to be created underneath

![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/d027793d-def2-4b26-8412-789dea7ceb29)


Next, choose your MongoDB database name, username, and password. If you accept the default, hidden password, a random password will be placed into the appropriate .env files and will be visible to you there after the project is created.

![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/d9211efe-fadd-44da-9be5-d784b3a78192)


Next, choose whether you want SSL or not. If you do, you must have openssl installed and be prepared to follow the prompts. In our case, we chose not to enable SSL.

![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/72498f8a-9525-48ca-b9d6-3dc9e6273f07)


After SSL options are decided or skipped, Project Albatross will run the initial project generation steps for you and being creating your application in the directory you specified above.

![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/ea7e89f8-8b28-4af0-95fd-749653930fc2)


This will continue for several minutes. When it completes, it will begin prompting us for Auth0 Configuration.

![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/31da07a7-cb7c-4e70-969a-128df331af20)


In the Auth0 dashboard, create your first tenant

![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/28632fad-b614-4625-bd40-872de364c55c)


Now delete the default application and create a new SPA application.
From it's Settings page, input the domain shown

![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/6dd6aa8d-4f07-4539-ac84-f16c9e07edaf)


![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/aa64f540-74e7-4572-9b17-f70972cba04a)


On the next prompt, input the client ID shown below the domain:

![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/0582d012-2c47-4ac2-94d8-460dccd3924c)


Next, set the callback, logout, origin, and CORS URLs in the settings of the SPA application in the Auth0 dashboard

![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/4cbf3ec7-86c2-40b1-92dc-c8c92ecd41df)


![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/48c9a4ad-9372-401c-93dc-4e812690d519)


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


![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/c45faae6-4340-4996-9bbe-284e8d2a69d6)


![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/0b333716-ef19-4e4d-8059-e1271e7b65e2)


Click Create API and then fill in the details

![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/383166be-6a6f-43ff-abbe-f05c64785f72)


In the new API, enable RBAC and "Add permissions in the Access Token".

![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/1817dbff-2aa8-49f3-a302-c148e67068ab)

![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/56bc672a-9826-40fc-9c76-b2e25eea8849)


Under the default API (Auth0 Management API), under Machine to Machine Applications, enable the new (Test Application) and select all permissions and then click update. 

![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/b6082ce8-58b9-4c15-87a7-65b6417fc722)


In the new API,

![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/3fe63ea6-02d5-4907-8aff-5eec330b673c)


Under Machine to Machine Applications, enable the new permissions

![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/43bdb1a4-d010-429b-ae13-8cbfbdeee9eb)


![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/4e184a86-1c47-47d1-972e-f87b51f4139e)


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

![image](https://github.com/Digital-Defiance/project-albatross/assets/3766240/85415618-f4b4-4216-ad94-70e7f91f60c9)

