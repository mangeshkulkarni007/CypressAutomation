**Cypress Automation Repository**

---

## Pipelines:

Current config runs the Test Suite against QA environment in the Bitbucket pipelines.
It will run automatically after opening and commiting to a Pull Request

You can download pipeline snapshot images - go to the pipeline Artifacts tab

## To run the automation locally:

### use the $environment.config.js depending on the env you would like to run the tests agains: DEV or QA

Run all tests in headless mode:
`npx cypress run --config-file cypress.dev.config.js`

open Cypress GUI:
`npx cypress open --config-file cypress.qa.config.js`

## Please add eslint flat config support in the VSCode

Please add the line below to the VSCODE "settings.json" file

`"eslint.experimental.useFlatConfig": true,`

OR enable by using the checkbox in the VSCode settings:

`ESLINT -> Experimental -> Use flat config`
