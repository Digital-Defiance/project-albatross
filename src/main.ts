#!/usr/bin/env node

import { exec } from 'child_process';
import {
  accessSync,
  constants as fsConstants,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmdirSync,
} from 'fs';
import inquirer from 'inquirer';
import mustache from 'mustache';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { IProject } from './interfaces/project';
import { ISSLOptions } from './interfaces/ssl-options';
import { IAuth0Options } from './interfaces/auth0-options';
import { randomBytes } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

enum DebugFlags {
  NONE = 0,
  ALLOW_PROJECT_DIR_EXIST,
  SKIP_AUTH0_CONFIG,
  SKIP_NX_CREATE,
  SKIP_NX_DEPENDENCIES,
  SKIP_OTHER_DEPENDENCIES,
  SKIP_CREATE_NODE,
  SKIP_CREATE_REACT,
  SKIP_CREATE_LIB,
  SKIP_SSL,
  SKIP_TEMPLATE_LIB,
  SKIP_TEMPLATE_NODE,
  SKIP_TEMPLATE_REACT,
  SKIP_TEMPLATE_DEVCONTAINER,
}

const DEBUG_FLAGS: Set<DebugFlags> = new Set();
function setDebugFlags(debugFlags: DebugFlags[]): void {
  for (const debugFlag of debugFlags) {
    DEBUG_FLAGS.add(debugFlag);
  }
}

async function skipIfDebugFlag(
  debugFlag: DebugFlags,
  callback: () => void,
): Promise<void> {
  if (!DEBUG_FLAGS.has(debugFlag)) {
    await callback();
  }
}

function hasDebugFlag(debugFlag: DebugFlags): boolean {
  return DEBUG_FLAGS.has(debugFlag);
}

class ProjectAlbatross {
  private project?: IProject;
  private projectPath?: string;
  private sslOptions?: ISSLOptions;
  private auth0Options?: IAuth0Options;
  private mongoDbPassword: string = randomBytes(16).toString('hex');
  private readonly dependencies: string[] = [
    '@auth0/auth0-react',
    '@auth0/auth0-spa-js',
    'auth0',
    'cors',
    'express-jwt',
    'express-oauth2-jwt-bearer',
    'helmet',
    'jsonwebtoken',
    'jwks-rsa',
    'jwt-decode',
    'mongoose',
    'morgan',
    'nocache',
    'validator',
  ];
  private readonly devDependencies: string[] = [
    '@types/auth0',
    '@types/cors',
    // '@types/express-session',
    '@types/jsonwebtoken',
    '@types/morgan',
    '@types/validator',
  ];

  constructor() { }

  async execute() {
    await this.showWelcome();
    this.project = await this.askForProjectName();
    this.projectPath = await this.askForProjectPath();
    const sslEnabled = hasDebugFlag(DebugFlags.SKIP_SSL)
      ? false
      : await this.promptSSL();
    if (sslEnabled) {
      this.sslOptions = await this.promptSSLDetails();
    }
    await this.checkPrerequisites();
    await skipIfDebugFlag(
      DebugFlags.SKIP_NX_CREATE,
      async () => await this.createNxMonorepo(),
    );
    await skipIfDebugFlag(
      DebugFlags.SKIP_NX_DEPENDENCIES,
      async () => await this.addNxDependencies(),
    );
    await skipIfDebugFlag(
      DebugFlags.SKIP_OTHER_DEPENDENCIES,
      async () => await this.addOtherDependencies(),
    );
    await skipIfDebugFlag(
      DebugFlags.SKIP_CREATE_NODE,
      async () => await this.createNodeApplication(),
    );
    await skipIfDebugFlag(
      DebugFlags.SKIP_CREATE_REACT,
      async () => await this.createReactApplication(),
    );
    await skipIfDebugFlag(
      DebugFlags.SKIP_CREATE_LIB,
      async () => await this.createJsLibrary(),
    );
    await skipIfDebugFlag(
      DebugFlags.SKIP_AUTH0_CONFIG,
      async () => await this.promptAuth0Options(),
    )
    await skipIfDebugFlag(
      DebugFlags.SKIP_TEMPLATE_LIB,
      async () => await this.setupLibTemplates(),
    );
    await skipIfDebugFlag(
      DebugFlags.SKIP_TEMPLATE_NODE,
      async () => await this.setupNodeTemplates(),
    );
    await skipIfDebugFlag(
      DebugFlags.SKIP_TEMPLATE_REACT,
      async () => await this.setupReactTemplates(),
    );
    await skipIfDebugFlag(
      DebugFlags.SKIP_TEMPLATE_DEVCONTAINER,
      async () => await this.setupDevcontainer(),
    );
    if (this.sslOptions) {
      await this.setupSSL();
    }
    console.log(`Your project has been set up at: ${this.projectPath}`);
    console.log("Don't forget to look over the .env files in the API and .devcontainer folders, then open your new project in VS Code and reopen in the devcontainer.");
    process.exit(0);
  }

  private async showWelcome(): Promise<void> {
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message:
          'Welcome to Project Albatross, a typescript NX/React/Auth0/Node/Mongo Application generator.\n\n' +
          'This helper will take you through the generation of an NX monorepo with a React frontend that uses Auth0 for authentication, ' +
          'a Node backend, and set up a devcontainer with a Mongo database.\n\n' +
          'Press enter to continue.',
      },
    ]);
  }

  private async askForProjectName(): Promise<IProject> {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message:
          'What would you like to name your project?\n\n' +
          'This will be the base application name and will be used to generate the project folder.\n\n' +
          'We will generate an NX monorepo with this name (which we will lowercase and hyphenate), and then we will generate ' +
          'a node application {your-project-name}-api, a react application {your-project-name}-react, and a library {your-project-name}-lib.\n\n' +
          'Project name should be the title of the project, begin with a letter and be alphanumeric with no special characters.',
        default: 'Your Project Name',
        validate: (input: string) => {
          const trimmedValue = input.trim();
          return trimmedValue && /^([a-zA-Z][a-zA-Z0-9 ]*)$/.test(trimmedValue)
            ? true
            : `Invalid Project Name. Please try again`;
        },
      },
    ]);

    const projectName = answers.name.toLowerCase().replace(/ /g, '-');
    return {
      name: answers.name,
      repoName: projectName,
      apiName: `${projectName}-api`,
      reactName: `${projectName}-react`,
      libName: `${projectName}-lib`,
    };
  }

  private async askForProjectPath(): Promise<string> {
    if (this.project === undefined) throw new Error('Project not set');
    const project = this.project;
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'path',
        message:
          'Where would you like to create your project?\n\n' +
          'Provide the path where the project should be created. The default is the current directory.\n\n' +
          `We will be running nx new and having it create a monorepo in this directory called ${project.repoName}`,
        default: process.cwd(),
        validate: (input: string) => {
          if (!input) {
            return 'Invalid directory path. Please provide a valid directory.';
          }
          if (existsSync(input) && lstatSync(input).isDirectory()) {
            // Check if directory is writable
            let isWritable: boolean;
            try {
              accessSync(input, fsConstants.W_OK);
              isWritable = true;
            } catch (err) {
              isWritable = false;
            }

            if (!isWritable) {
              return 'Directory is not writable. Please select a different directory.';
            }

            // Check if the NX repo name already exists in the directory
            if (
              !hasDebugFlag(DebugFlags.ALLOW_PROJECT_DIR_EXIST) &&
              existsSync(join(input, project.repoName))
            ) {
              return `A directory with the name ${project.repoName} already exists in the selected path.`;
            }

            return true;
          } else {
            return 'Invalid directory path. Please provide a valid directory.';
          }
        },
      },
    ]);

    return answers.path;
  }

  private async promptSSL(): Promise<boolean> {
    const { enableSSL } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'enableSSL',
        message: 'Enable SSL?',
        default: false,
      },
    ]);

    return enableSSL;
  }

  private async promptSSLDetails(): Promise<ISSLOptions> {
    if (!this.project) throw new Error('Project not set');
    const questions = [
      {
        type: 'input',
        name: 'country',
        message: 'Country Name (2 letter code):',
        default: 'US',
        validate: (input: string) => {
          return /^[A-Z]{2}$/.test(input) ? true : 'Invalid input';
        },
      },
      {
        type: 'input',
        name: 'state',
        message: 'State or Province Name (full name):',
        default: 'California',
        validate: (input: string) => {
          return /^[A-Za-z\s]+$/.test(input) ? true : 'Invalid input';
        },
      },
      {
        type: 'input',
        name: 'locality',
        message: 'City:',
        default: 'Los Angeles',
        validate: (input: string) => {
          return /^[A-Za-z\s]+$/.test(input) ? true : 'Invalid input';
        },
      },
      {
        type: 'input',
        name: 'company',
        message: 'Organization Name (company):',
        default: this.project.name,
        validate: (input: string) => {
          return /^[A-Za-z0-9\s]+$/.test(input) ? true : 'Invalid input';
        },
      },
    ];

    const answers = await inquirer.prompt(questions);
    return {
      country: answers.country,
      state: answers.state,
      locality: answers.locality,
      company: answers.company,
      host: 'localhost',
    };
  }

  private async promptAuth0Options(): Promise<void> {
    if (!this.project) throw new Error('Project not set');
    console.log('Auth0 Configuration');
    const auth0Options: IAuth0Options = {
      audience: this.sslOptions ? 'https://localhost:3000' : 'http://localhost:3000/',
      callbackUrl: this.sslOptions ? 'https://localhost:3000/callback' : 'http://localhost:3000/callback',
      countryCode: 'us',
      domain: `${this.project.repoName}.us.auth0.com`,
      nodeClientId: 'aBcdEFGHiJklMNO1pQ2rst3UVWxyZabC',
      nodeClientSecret: '',
      reactClientId: 'bCdeFGHIjKlmNOP1qR2stu3VWXyzAbcD',
      scope: 'create:users',
      tenantName: this.project.repoName
    };
    while (true) {
      const domainAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'domain',
          message:
            'First, log into auth0 via https://auth0.com/api/auth/login?redirectTo=dashboard, and create a tenant.\n' +
            `Input its domain here. It should look like something like '${this.project.repoName}.us.auth0.com'`,
          default: auth0Options.domain,
        },
      ]);
      const domain = domainAnswer.domain as string;
      if (!domain.endsWith('.auth0.com')) {
        console.log('Auth0 domain must end with .auth0.com');
      } else {
        const domainWithoutTLD = auth0Options.domain.replace('.auth0.com', '');
        // now get the country (auth0Options.domain should now have 'my-tenant.us' for example)
        const dotIndex = domainWithoutTLD.indexOf('.');
        if (dotIndex <= 0) {
          console.log('Auth0 domain should have a .us.auth0.com or other country code ending');
          continue;
        }
        auth0Options.domain = domain;
        auth0Options.countryCode = domainWithoutTLD.substring(dotIndex + 1);
        auth0Options.tenantName = domainWithoutTLD.substring(0, dotIndex);
        break;
      }
    }

    while (true) {
      const reactClientIdAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'reactClientId',
          message: 'Now delete the default auth0 application, and create a new SPA application.\n' +
            'What is the Client ID for the SPA application?',
          default: auth0Options.reactClientId,
        },
      ]);
      const reactClientId = reactClientIdAnswers.reactClientId as string;
      if (!reactClientId || reactClientId.trim().length === 0) {
        console.log('Please enter a valid react client ID');
      } else {
        auth0Options.reactClientId = reactClientId;
        break;
      }
    }

    console.log();
    console.log('In the settings for your client application, be sure to set:');
    console.log(`  - Allowed Callback URLs to "${this.sslOptions ? 'https' : 'http'}://localhost:3000/callback"`);
    console.log(`  - Allowed Logout URLs to "${this.sslOptions ? 'https' : 'http'}://localhost:3000/`);
    console.log(`  - Allowed Web Origins to "${this.sslOptions ? 'https' : 'http'}://localhost:3000/`);
    console.log(`  - Allowed Origins (CORS) to "${this.sslOptions ? 'https' : 'http'}://localhost:3000/`);
    console.log();
    console.log(`Now create a new API via https://manage.auth0.com/dashboard/${auth0Options.countryCode}/${auth0Options.tenantName}/apis.`);
    console.log(`Be sure the identifier is set to '${auth0Options.audience}' (trailing slash is important) and signing algorithm is RS256`);
    console.log('Now, under its settings, enable RBAC, and "Add permissions in the access token" and click save.');
    console.log('Under Permissions for the new API, add "create:users"');
    console.log('Then go into the settings for the default "Auth0 Management API" under Machine to Machine Applications and enable your new API.');
    console.log();

    while (true) {
      const reactNodeClientAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'nodeClientId',
          message: 'The previous step creating the API should have created a new Machine to Machine application.\n' +
            'Under its Settings, what is its Client ID?',
          default: auth0Options.nodeClientId
        },
        {
          type: 'password',
          name: 'nodeClientSecret',
          message: 'What is the Client Secret?',
          default: auth0Options.nodeClientSecret
        }
      ]);
      const nodeClientId = reactNodeClientAnswers.nodeClientId as string;
      if (!nodeClientId || nodeClientId.trim().length === 0) {
        console.log('Please enter a valid node Client ID');
        continue;
      } else {
        auth0Options.nodeClientId = nodeClientId;
      }
      const nodeClientSecret = reactNodeClientAnswers.nodeClientSecret as string;
      if (!nodeClientSecret || nodeClientSecret.trim().length === 0) {
        console.log('Please enter a valid Client Secret');
        continue;
      } else {
        auth0Options.nodeClientSecret = nodeClientSecret;
      }

      console.log();
      console.log(`Under Authentication > Social via https://manage.auth0.com/dashboard/${auth0Options.countryCode}/${auth0Options.tenantName}/connections/social, feel free to delete the Google connector`);
      console.log(`Under Actions > Flows via https://manage.auth0.com/dashboard/${auth0Options.countryCode}/${auth0Options.tenantName}/actions/flows, create a new custom Login flow called "Email Verification" with the following:`)
      console.log(`exports.onExecutePostLogin = async (event, api) => {
          if (!event.user.email_verified) {
            api.access.deny('Please verify your email before logging in.');
          }
        }`);
      console.log('Add the new Action to the Login flow');
      console.log('Create another flow called "Add RBAC Roles" with the following:');
      console.log(`exports.onExecutePostLogin = async (event, api) => {
        const namespace = 'https://${this.project.repoName}.us.auth0.com/';
      
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
      };`)
      console.log("Add the new Action to the Login flow after the Email Verification action");
      console.log("Auth0 should be configured and good to go at this point");
      console.log();
      break;
    }

    this.auth0Options = auth0Options;
  }

  private async createNxMonorepo(): Promise<void> {
    if (!this.project) throw new Error('Project not set');
    if (!this.projectPath) throw new Error('Project path not set');
    await this.executeCommand(
      `npx create-nx-workspace ${this.project.repoName} --preset=ts --cli=nx --nx-cloud=false --linter=eslint --packageManager=yarn --strict`,
      this.projectPath,
      'Creating NX Monorepo',
    );
  }

  private async addNxDependencies(): Promise<void> {
    if (!this.project) throw new Error('Project not set');
    if (!this.projectPath) throw new Error('Project path not set');
    await this.executeCommand(
      'yarn add @nx/js @nx/node @nx/react',
      join(this.projectPath, this.project.repoName),
      'Adding NX dependencies',
    );
  }

  private async addOtherDependencies(): Promise<void> {
    if (!this.project) throw new Error('Project not set');
    if (!this.projectPath) throw new Error('Project path not set');
    await this.executeCommand(
      `yarn add ${this.dependencies.join(' ')}`,
      join(this.projectPath, this.project.repoName),
      'Adding other dependencies with yarn add',
    );
    await this.executeCommand(
      `yarn add --dev ${this.devDependencies.join(' ')}`,
      join(this.projectPath, this.project.repoName),
      'Adding other devDependencies with yarn add --dev',
    );
  }

  private async createNodeApplication(): Promise<void> {
    if (!this.project) throw new Error('Project not set');
    if (!this.projectPath) throw new Error('Project path not set');
    await this.executeCommand(
      `nx g @nx/node:application ${this.project.apiName} --language=ts`,
      join(this.projectPath, this.project.repoName),
      'Creating Node Application',
    );
  }

  private async createReactApplication(): Promise<void> {
    if (!this.project) throw new Error('Project not set');
    if (!this.projectPath) throw new Error('Project path not set');
    await this.executeCommand(
      `nx g @nx/react:application ${this.project.reactName} --language=ts`,
      join(this.projectPath, this.project.repoName),
      'Creating React Application',
    );
  }

  private async createJsLibrary(): Promise<void> {
    if (!this.project) throw new Error('Project not set');
    if (!this.projectPath) throw new Error('Project path not set');
    await this.executeCommand(
      `nx g @nx/js:lib ${this.project.libName} --language=ts`,
      join(this.projectPath, this.project.repoName),
      'Creating Javascript Library',
    );
  }

  private async setupSSL(): Promise<void> {
    if (!this.sslOptions) return;
    if (!this.project) throw new Error('Project not set');
    if (!this.projectPath) throw new Error('Project path not set');
    const apiPath = join(
      this.projectPath,
      this.project.repoName,
      this.project.apiName,
    );
    const localdevPath = join(apiPath, 'localdev');
    if (!existsSync(localdevPath)) {
      mkdirSync(localdevPath);
    }
    const command = `openssl req -x509 -nodes -newkey rsa:4096 -keyout cert.key -out cert.pem -days 365 -subj "/C=${this.sslOptions.country}/ST=${this.sslOptions.state}/L=${this.sslOptions.locality}/O=${this.sslOptions.company}/CN=${this.sslOptions.host}"`;
    await this.executeCommand(
      command,
      localdevPath,
      'Creating SSL certificate',
    );
  }

  // Utility method to abstract the command execution logic
  private async executeCommand(
    command: string,
    cwd: string,
    label: string,
  ): Promise<void> {
    console.log(label);
    console.log(`Executing ${command}`);
    return new Promise((resolve, reject) => {
      const childProcess = exec(command, { cwd }, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject(error);
          return;
        }
      });

      if (!childProcess.stdout || !childProcess.stderr) {
        reject(new Error(`Failed to execute command: ${command}`));
        return;
      }

      childProcess.stdout.on('data', (data) => {
        console.log(data);
      });

      childProcess.stderr.on('data', (data) => {
        console.error(data);
      });

      childProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Process exited with code: ${code}`));
        } else {
          resolve();
        }
      });
    });
  }

  private async setupTemplates(
    templateFiles: string[],
    sourceRoot: string,
    destRoot: string,
  ): Promise<void> {
    if (!this.project) throw new Error('Project not set');
    if (!this.projectPath) throw new Error('Project path not set');
    for (const templateFile of templateFiles) {
      // make sure the directory exists
      const directory = dirname(templateFile);
      const sourceFile = join(sourceRoot, `${templateFile}.hbs`);
      if (!existsSync(sourceFile)) {
        throw new Error(`Source file ${sourceFile} does not exist`);
      }
      const destDir = join(destRoot, directory);
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      // use handlebars and template each file
      const templateContent = readFileSync(sourceFile, 'utf-8');
      const data = {
        PROJECT_NAME: this.project.name,
        PROJECT_REPO_NAME: this.project.repoName,
        PROJECT_API_NAME: this.project.apiName,
        PROJECT_REACT_NAME: this.project.reactName,
        PROJECT_LIB_NAME: this.project.libName,
        PROJECT_PATH: this.projectPath,
        SSL_ENABLED: this.sslOptions !== undefined,
        SSL_ENABLED_STRING: this.sslOptions !== undefined ? 'true' : 'false',
        SSL_COMPANY: this.sslOptions?.company,
        SSL_COUNTRY: this.sslOptions?.country,
        SSL_LOCALITY: this.sslOptions?.locality,
        SSL_STATE: this.sslOptions?.state,
        AUTH0_AUDIENCE: this.auth0Options?.audience,
        AUTH0_CALLBACK_URL: this.auth0Options?.callbackUrl,
        AUTH0_COUNTRY_CODE: this.auth0Options?.countryCode,
        AUTH0_DOMAIN: this.auth0Options?.domain,
        AUTH0_NODE_CLIENT_ID: this.auth0Options?.nodeClientId,
        AUTH0_NODE_CLIENT_SECRET: this.auth0Options?.nodeClientSecret,
        AUTH0_REACT_CLIENT_ID: this.auth0Options?.reactClientId,
        AUTH0_SCOPE: this.auth0Options?.scope,
        AUTH0_TENANT_NAME: this.auth0Options?.tenantName,
        MONGO_DB_PASSWORD: this.mongoDbPassword,
      };
      const result = mustache.render(templateContent, data);
      const destFile = join(destRoot, templateFile);
      console.log(`Writing ${destFile}`);
      writeFileSync(destFile, result);
    }
  }

  private async setupLibTemplates(): Promise<void> {
    console.log('Setting up lib templates');
    if (!this.project) throw new Error('Project not set');
    if (!this.projectPath) throw new Error('Project path not set');
    const libDir = join(
      this.projectPath,
      this.project.repoName,
      this.project.libName,
      'src',
      'lib',
    );
    if (existsSync(libDir)) {
      console.log('Deleting the default lib directory');
      rmdirSync(libDir, { recursive: true });
    }
    console.log('Beginning templating for lib');
    // use handlebars and template each file
    const libTemplates = [
      'src/lib/enumerations/modelName.ts',
      'src/lib/enumerations/modelNameCollection.ts',
      'src/lib/interfaces/hasCreation.ts',
      'src/lib/interfaces/hasCreator.ts',
      'src/lib/interfaces/hasDeleter.ts',
      'src/lib/interfaces/hasId.ts',
      'src/lib/interfaces/hasSoftDelete.ts',
      'src/lib/interfaces/hasTimestampOwners.ts',
      'src/lib/interfaces/hasTimestamps.ts',
      'src/lib/interfaces/hasUpdater.ts',
      'src/lib/interfaces/hasUpdates.ts',
      'src/lib/interfaces/modelData.ts',
      'src/lib/interfaces/schemaModelData.ts',
      'src/lib/interfaces/schemaModels.ts',
      'src/lib/interfaces/user.ts',
      'src/lib/models/baseModel.spec.ts',
      'src/lib/models/baseModel.ts',
      'src/lib/schemas/user.ts',
      'src/index.ts',
      'src/lib/schema.ts',
      'src/lib/schemaModelData.ts',
    ];
    const sourceDir = join(__dirname, '..', 'templates', 'lib');
    const destDir = join(
      this.projectPath,
      this.project.repoName,
      this.project.libName,
    );
    await this.setupTemplates(libTemplates, sourceDir, destDir);
  }

  private async setupNodeTemplates(): Promise<void> {
    console.log('Setting up node templates');
    if (!this.project) throw new Error('Project not set');
    if (!this.projectPath) throw new Error('Project path not set');
    // use handlebars and template each file
    const nodeTemplates = [
      '.env',
      '.env.example',
      'src/errors/emailExists.ts',
      'src/errors/invalidEmail.ts',
      'src/errors/invalidPassword.ts',
      'src/errors/usernameExists.ts',
      'src/interfaces/environment.ts',
      'src/middlewares/auth0.ts',
      'src/middlewares/error.ts',
      'src/middlewares/not-found.ts',
      'src/routes/api.route.ts',
      'src/routes/users.route.ts',
      'src/services/jwtService.ts',
      'src/services/userService.ts',
      'src/auth0.ts',
      'src/cors.ts',
      'src/environment.ts',
      'src/main.ts',
      'src/setupDatabase.ts',
      'src/setupMiddlewares.ts',
      'src/setupRoutes.ts',
      'src/setupStaticReactApp.ts',
    ];
    const sourceDir = join(__dirname, '..', 'templates', 'node');
    const destDir = join(
      this.projectPath,
      this.project.repoName,
      this.project.apiName,
    );
    await this.setupTemplates(nodeTemplates, sourceDir, destDir);
  }

  private async setupReactTemplates(): Promise<void> {
    console.log('Setting up react templates');
    if (!this.project) throw new Error('Project not set');
    if (!this.projectPath) throw new Error('Project path not set');
    // use handlebars and template each file
    const reactTemplates = [
      'src/app/app.tsx',
      'src/components/api-access.tsx',
      'src/components/authentication-required.tsx',
      'src/components/callback.tsx',
      'src/components/login-button.tsx',
      'src/components/login-link.scss',
      'src/components/login-link.tsx',
      'src/components/logout-link.scss',
      'src/components/logout-link.tsx',
      'src/components/not-found.tsx',
      'src/components/page-loader.tsx',
      'src/environments/environment.prod.ts',
      'src/environments/environment.ts',
      'src/interfaces/environment.ts',
      'src/pages/account-error.tsx',
      'src/pages/user-profile.tsx',
      'src/main.tsx',
    ];
    const sourceDir = join(__dirname, '..', 'templates', 'react');
    const destDir = join(
      this.projectPath,
      this.project.repoName,
      this.project.reactName,
    );
    await this.setupTemplates(reactTemplates, sourceDir, destDir);
  }

  private async setupDevcontainer(): Promise<void> {
    console.log('Setting up react templates');
    if (!this.project) throw new Error('Project not set');
    if (!this.projectPath) throw new Error('Project path not set');
    // use handlebars and template each file
    const devcontainerTemplates = [
      '.env',
      '.env.example',
      'devcontainer.json',
      'docker-compose.yml',
    ];
    const sourceDir = join(__dirname, '..', 'templates', 'devcontainer');
    const destDir = join(
      this.projectPath,
      this.project.repoName,
      '.devcontainer',
    );
    await this.setupTemplates(devcontainerTemplates, sourceDir, destDir);
  }

  private async checkPrerequisites(): Promise<void> {
    // make sure node, NX and openssl are installed
    // these awaits either reject or succeed, so no need to check the result
    let nodeOk = false
    try {
      await this.executeCommand('node -v', process.cwd(), 'Checking Node version');
      nodeOk = true;
    }
    catch (err) {
      console.log('Node is not installed');
    }
    let nxOk = false;
    try {
      await this.executeCommand('nx --version', process.cwd(), 'Checking NX version');
    }
    catch (err) {
      console.log('NX is not installed');
      throw new Error('NX is not installed');
    }
    let yarnOk = false;
    try {
      await this.executeCommand('yarn -v', process.cwd(), 'Checking Yarn version');
      yarnOk = true;
    }
    catch (err) {
      console.log('Yarn is not installed');
      throw new Error('Yarn is not installed');
    }
    let openSSLOk = false;
    if (this.sslOptions !== undefined) {
      try {
        await this.executeCommand('openssl version', process.cwd(), 'Checking OpenSSL version');
        openSSLOk = true;
      }
      catch (err) {
        console.log('OpenSSL is not installed');
        throw new Error('OpenSSL is not installed');
      }
    }
  }

  private async promptMongoDbPassword(): Promise<void> {
    while (true) {
      const { mongoDbPassword } = await inquirer.prompt([
        {
          type: 'password',
          name: 'mongoDbPassword',
          message: 'What do you want your MongoDB Password to be?',
          default: this.mongoDbPassword,
        },
      ]);
      if (!mongoDbPassword || mongoDbPassword.trim().length === 0) {
        console.log('Please enter a valid MongoDB Password');
        continue;
      }
      this.mongoDbPassword = mongoDbPassword;
      break;
    }
  }
}

setDebugFlags([
  // DebugFlags.ALLOW_PROJECT_DIR_EXIST,
  // DebugFlags.SKIP_NX_CREATE,
  // DebugFlags.SKIP_NX_DEPENDENCIES,
  // DebugFlags.SKIP_OTHER_DEPENDENCIES,
  // DebugFlags.SKIP_CREATE_NODE,
  // DebugFlags.SKIP_CREATE_REACT,
  // DebugFlags.SKIP_CREATE_LIB,
  // DebugFlags.SKIP_SSL,
  // DebugFlags.SKIP_AUTH0_CONFIG,
  // DebugFlags.SKIP_TEMPLATE_LIB,
  // DebugFlags.SKIP_TEMPLATE_NODE,
  // DebugFlags.SKIP_CREATE_REACT,
  // DebugFlags.SKIP_TEMPLATE_DEVCONTAINER,
]);

const app = new ProjectAlbatross();
app.execute();
