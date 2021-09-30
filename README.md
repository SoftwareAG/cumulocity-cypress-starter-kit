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
In this example we want to test locally, so we run:
```
npm run start
```

The last step before we can let Cypress do it's magic is to tell Cypress which tenant you want to target with which user.
You have 2 options:
* (a) setup environment variables CYPRESS_tenant, CYPRESS_username and CYPRESS_password in your OS, or
* (b) run Cypress with these variables as arguments of the command

Now you can start the test runner.
If you went way (a) you just need to run:
```
npx cypress open
```
If you want to go way (b) then run:
```
npx cypress run --headed --env tenant=tenantId,username=Your.Mail@softwareag.com,password=YourPassword
```

**Prerequisites:**
  
* Git
  
* NodeJS
  
* NPM
  
**External dependencies:**

```
"cypress": "^8.4.0",
```

## Troubleshooting

------------------------------
  
  
This widget is provided as-is and without warranty or support. They do not constitute part of the Software AG product suite. Users are free to use, fork and modify them, subject to the license agreement. While Software AG welcomes contributions, we cannot guarantee to include every contribution in the master project.
  
_____________________
  
For more information you can Ask a Question in the [TECHcommunity Forums](http://tech.forums.softwareag.com/techjforum/forums/list.page?product=cumulocity).
  
  
You can find additional information in the [Software AG TECHcommunity](http://techcommunity.softwareag.com/home/-/product/name/cumulocity).
