# Cumulocity Cypress Starter-Kit

##  Overview

This is a cockpit clone configured to run the Cypress frontend testing tool.
Cypress enables you to write all types of tests:
* End-to-end tests
* Integration tests
* Unit tests

## Your first test run
Usage of Visual Studio Code is recommended. In VSCode open a new terminal in which you will type the following commands:

Install the dependencies:
```
npm i
```

In order to run tests, you either need to connect to a remote server already running the UI to test, or start a local server.
In this example we want to test locally, so change the targeted server in the start script of the package.json to the tenant you like.
Then run:
```
npm run start
```

The last step before we can let Cypress do it's magic is to tell Cypress which tenant you want to target with which user.
You have 2 options:
* (a) setup environment variables CYPRESS_tenant, CYPRESS_username and CYPRESS_password in your OS, or
* (b) create a cypress.env.json file in the root of this project, with your tenant specific credentials, e.g.:
```
{
    "tenant": "t12345678",
    "username": "Your.Mail@softwareag.com",
    "password": "SuP3rS3cUReP455w0rd!"
}
``` 
Note: Please never commit your personal credentials. Do not change the .gitignore to allow commit of cypress.env.json as it will contain secrets!

Now you can start the test runner (by opening a second terminal in VSCode):
```
npx cypress open (or npx cypress run if you prefer to stay in the terminal)
```

## Vision
Not only shall this be a good starting point for you to enable you to write your first end to end tests for your Cumulocity UI project. In the future this project will contain utility functions to conveniently access Cumulocity specific UI parts, such as the side navigation, alerts, toolbar buttons, etc.  

**Prerequisites:**

* Access to a tenant with OAuth internal enabled

* Git
  
* NodeJS
  
* NPM
  
**External dependencies:**

```
"cypress": "^8.5.0",
```

## Troubleshooting

------------------------------
  
  
This widget is provided as-is and without warranty or support. They do not constitute part of the Software AG product suite. Users are free to use, fork and modify them, subject to the license agreement. While Software AG welcomes contributions, we cannot guarantee to include every contribution in the master project.
  
_____________________
  
For more information you can Ask a Question in the [TECHcommunity Forums](http://tech.forums.softwareag.com/techjforum/forums/list.page?product=cumulocity).
  
  
You can find additional information in the [Software AG TECHcommunity](http://techcommunity.softwareag.com/home/-/product/name/cumulocity).
