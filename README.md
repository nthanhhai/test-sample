# Sample Test repository for Codility

## Introduction
The tests were developed using
- Protractor
- Cucumber
- Selenium
- NodeJS
- JavaScript

## Structure
### feature_files
Contains all the feature files and all the tests of features. For this particular test, the feature file is `test.feature` file

### page_objects
Contains all page objects. For this partcular test, the page object is `test_po.js` file

### step_definitions
Contains all step definitions to be used in feature file. For this test, the step definitions are stored in `test_steps.js` file.

## Pre-requisites
1. NodeJS
2. webdriver-manager

## Run Test
1. Open new terminal
2. Start webdriver-manager `webdriver-manager start`
3. Open new terminal
4. Navigate to root folder
5. Run this command `npm install`
6. Run this command `npm run test-local`
