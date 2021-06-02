'use strict'
// Declaration
const EC = protractor.ExpectedConditions;
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const {
    Before,
    Given,
    When,
    Then,
    After,
    Status
} = require(path.join(
    __dirname,
    '..',
    'node_modules',
    'protractor-cucumber-framework',
    'lib',
    'cucumberLoader'    
)).load();

var HomePage = require('../page_objects/homepage_po');

// ===================BEFORE===================
Before({
    timeout: 2 * 5000
}, async function (scenario) {
    var width = 1440;
    var height = 900;
    console.log('>>>> Running scenario: ' + scenario.pickle.name);
    await browser.driver.manage().window().setSize(width, height);
    console.log('Set the browser size to ' + width + 'x' + height);
});
// ===================AFTER===================
After(async function (testCase) {
    var world = this;
    var alertShown = false;
    try {
        await browser.switchTo().alert().dismiss();
        alertShown = true;
    } catch(err) {}        
    if (testCase.result.status === Status.FAILED) {
        var screenShot = await browser.takeScreenshot();
        console.log('Alert shown = ' + alertShown + '. Scenario failed, taking screenshot!!!!!');
        await world.attach(screenShot, 'image/png');
    }
});

// ===================GIVEN===================
When('I open Commbank Home Page', {
    timeout: 6 * 5000
}, async function () {
    var homePage = new HomePage();

    await homePage.goto();
});

// ===================WHEN===================
When('I click on {string} in top menu', {
    timeout: 6 * 5000
}, async function (topNav) {
    var homePage = new HomePage();
    var nav = element(by.cssContainingText('li[role=listitem]', topNav));

    await nav.click();
});

// ===================THEN===================
// Then('Example', {
//     timeout: 6 * 5000
// }, async function () {
//     var homePage = new HomePage();
    
// });