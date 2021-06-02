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

var BankingPage = require('../page_objects/banking_po');
// ===================GIVEN===================

// ===================WHEN===================
When('I click on {string} section', {
    timeout: 6 * 5000
}, async function (sectionNav) {
    var bankingPage = new BankingPage();
    var nav = element(by.cssContainingText('li', sectionNav));
    await bankingPage.waitUntilVisible(nav, 3000);
    await nav.click();
});

// ===================THEN===================
// Then('Example', {
//     timeout: 6 * 5000
// }, async function () {
//     var bankingPage = new BankingPage();
    
// });