![logo](logo.png)

The "Office Check-In" application provides a **flexible and simple management of office spaces**. 

Team manager can create office areas and specify the **maximum occupancy** that is allowed there. Employees can **book days at their office location**, the application tracks the usage and **keeps the presence below the defined threshold**.

Take a look at the [user manual](docs/manual.md) to see how Office Check-In can help you to stay safe at the office.

## Table of Contents

- [Setup](#setup)
  - [Precondition](#precondition)
  - [Create firebase projects](#create-firebase-projects)
  - [Firebase CLI login](#firebase-cli-login)
  - [Configure your firebase environments](#configure-your-firebase-environments)
    - [Cloud Firestore](#cloud-firestore)
    - [Add firebase configuration to the frontend](#add-firebase-configuration-to-the-frontend)
    - [Prepare Hosting](#prepare-hosting)
    - [Prepare firebase backend](#prepare-firebase-backend)
    - [Deploy firebase backend](#deploy-firebase-backend)
  - [Setup Firebase Authentication](#setup-firebase-authentication)
    - [Setup authentication method](#setup-authentication-method)
    - [Setup e-mail registration](#setup-e-mail-registration)
    - [Authorized domains](#authorized-domains)
  - [Build and deploy frontend](#build-and-deploy-frontend)
- [Contributing](#contributing)
  - [Covenant Code of Conduct](#covenant-code-of-conduct)
  - [Contributing Guide](#contributing-guide)
  - [Versioning](#versioning)
  - [License](#license)

## Setup

This setup guide will give you two environments, `dev` and `prod`. In case you do not want to develop on the code and just use it "as is", one environment is sufficient, as the `dev` environment is used for development only. 

Additionally, the code in this repository is meant to be run on the paid "Blaze Plan" of Firebase. It is possible to use the free "Spark Plan", see the notes regarding backend deployment for the modifications necessary to do so. 

### Precondition 

- You need a Google Account to create and manage a [Google Firebase](https://firebase.google.com/) project. Later on you could give other Google Accounts permission to manage your project.
- **Firebase Tools** have to be installed. Run `npm install -g firebase-tools` to do so.
- Note: **If your Firebase project is using the free "Spark Plan", you need to modify backend/functions/package.json (see below)**

### Create firebase projects

We are now going to create a `dev` and `prod` environment. Feel free to add further environments later.

In order to deploy the application create a [Google Firebase](https://firebase.google.com/) project first. To do that visit [Google Firebase Console](https://console.firebase.google.com) (you need to login to your Google Account) and click on **Add project**. Give your project a **PROJECT_NAME** with suffix `-dev`. 

Add another firebase project **PROJECT_NAME** with suffix `-prod`.

Now you should have two projects 

- <PROJECT_NAME>-dev
- <PROJECT_NAME>-prod

In case your chosen PROJECT_NAME plus suffix wasn't available anymore, Google appended another id. Later when referencing to <PROJECT_NAME>-<dev | prod> append this id.

### Firebase CLI login

Login to firebase using firebase cli (logout only in case you are already logged in to another account)
```sh
$ firebase logout 
$ firebase login
```

### Configure your firebase environments

#### Cloud Firestore
You need to enable the cloud firestore within your project. Go to `Develop -> Cloud Firestore` in your firebase console.

#### Add firebase configuration to the frontend

First **you need to add a firebase web app to each project** `Project Settings -> Overview -> Your apps`. Set a nickname and check the "Also set up Firebase Hosting for this app" checkbox. Then register the app. 

Retrieve the Firebase configuration from the Firebase console for both projects (dev and prod). 

Go to `Project Settings -> Overview -> Firebase SDK Snippets`and select `Configuration`. Note: You don't need to copy and paste the sdk scripts. We add the sdk on a different location later in this guide.

Add the snippet for **PROJECT_NAME**-dev to `frontend/src/environment/environment.ts`

```javascript
export const environment = {
  production: false,
  appVersion: require('../../package.json').version + '-dev',
	// add the firebase sdk snippet here:
  firebase: {
    apiKey: '[API_KEY]',
    authDomain: '[DOMAIN]',
    databaseURL: '[DATABASE_URL]',
    projectId: '[PROJECT_ID]',
    storageBucket: '[STORAGE_BUCKET]',
    messagingSenderId: '[ID]',
  }
};
```

Do the same for **PROJECT_NAME**-prod and `frontend/src/environment/environment.prod.ts`


#### Prepare Hosting
Make sure your `pwd` is `frontend`

```sh
$ firebase use --add
```
Choose your **PROJECT_NAME**-dev, press ENTER

Type `dev` as alias, press ENTER

Run following command, replace <PROJECT_NAME> with your **PROJECT_NAME**
```sh
$ firebase target:apply hosting dev <PROJECT_NAME>-dev
```

Now repeat for prod environment

```sh
$ firebase use --add
```

Choose your **PROJECT_NAME**-prod, press ENTER

Type `prod` as alias, press ENTER

Run following commands, replace <PROJECT_NAME> with your **PROJECT_NAME**
```sh
$ firebase target:apply hosting prod <PROJECT_NAME>-prod
```

You should push `.firebaserc` to your repo.

#### Prepare firebase backend
Make sure your `pwd` is `backend`. 

Change to the `functions` directory and install all neccessary dependencies by running `npm i`. 

Then build the functions by running `npm run build`. 

Next step is to configure the firebase.json and .firebaserc file in the backend folder. You can simple copy the .firebaserc file from the frontend directory (from your backend directory run `cp ../frontend/.firebaserc .`).

#### Deploy firebase backend
Run following command to deploy to **DEV**

```sh
$ deploy-dev.sh
```

Run following command to deploy to **PROD**

```sh
$ deploy-prod.sh
```

Note: If you get this error message: **"Error: HTTP Error: 400, Billing account for project <YOUR-PROJECT> is not found. Billing must be enabled for activation of service(s) 'cloudbuild.googleapis.com,containerregistry.googleapis.com' to proceed."** your project is using the free "Spark Plan" and some changes are required to run Cloud Functions. 

First you need to modify `backend/functions/package.json`. Add these lines:

```javascript
"engines": {
  "node": "8"
}
```
Secondly, set the version of the "firebase-admin" to "8.10.0".
```javascript
"dependencies": {
  "deep-object-diff": "^1.1.0",
  "firebase-admin": "8.10.0",
  "firebase-functions": "3.11.0",
  "moment": "^2.26.0"
}
```

The better approach is to use the "Blaze Plan" and to use the current node version, as using `node:8` will be deprecated in 2021.

### Setup Firebase Authentication

Go to your Firebase Console and select your project. Select `Authentication`from the left-side menu unter `Develop`. 

#### Setup authentication method

On the Authentication page select `Sign-in Method`and then enable the E-Mail/Password method. Now you've setup the authentication method to be E-mail and Password, as required in the source code.

#### Setup e-mail registration

On the Authentication page select `Templates`. Here you should input your desired templates for `E-mail Registration`, `Password Reset` and `E-mail change` - the latter is not supported in this source code version.

#### Authorized domains

On the Authentication page you should input the authorized domains, i.e. the domains where your app is deployed, so that Google allows the oAuth authentication.

### Build and deploy frontend

Within `frontend` directory

before first run

```sh
$ npm install
```

to build and deploy to **DEV**

```sh
$ npm run deploy-dev
```

and to build and deploy to **PROD**

```sh
$ npm run deploy-prod
```

After this command you see hosting URL of your deployed app. Optional you can configure firebase to use your company domain for hosting. 


## Contributing

While "Office Check-In" is actively backed by e.on's engineering team, the main purpose of this repository is to continue to improve "Office Check-In" and to make it easier to use. We are grateful to each contributors and encourage you to participate by reporting bugs, ask for improvements and propose changes to the code.

### Covenant Code of Conduct

"Office Check-In" has adopted the Contributor Covenant Code of Conduct (version 2.0), find it [here](https://github.com/eon-com/office-check-in/blob/master/CODE_OF_CONDUCT.md). 
We expect project participants to adhere to it.

### Contributing Guide

All work on "Office Check-In" happens directly on [GitHub](https://github.com/eon-com/office-check-in). Both e.on team members and external contributors send pull requests which go through the same review process. Submit all changes directly to the [`master branch`](https://github.com/eon-com/office-check-in/tree/master). We don’t use separate branches for development or for upcoming releases.

To report a bug or a feedback, use [GitHub Issues](https://github.com/eon-com/office-check-in/issues). We keep a close eye on this and try to labelize each new request. If you're fixing a bug or working on a new feature, submit a [pull request](https://github.com/eon-com/office-check-in/pulls) with detail on which changes you've made.

While there are no templates yet when opening a PR or an issue, we still recommend to provide as much detail as possible. Consider that someone external to the project should understand your request at first glance.

### Versioning
The app uses `npm version` to set the application version.
Once a new version should be defined run `npm version patch|minor|major` (see `npm version --help`) after committing all changes. The new version will be written to package.json and version.json.

### License

Copyright 2020 EON.SE 

"Office Check-In" is Apache licensed. See the [LICENSE file](https://github.com/eon-com/office-check-in/blob/master/LICENSE) for more information.

made with ❤️ by d lab_
