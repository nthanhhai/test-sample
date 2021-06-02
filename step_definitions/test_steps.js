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

var TestPage = require('../page_objects/test_po');
const { browser } = require('protractor');

// ===================GIVEN===================
Given('I open Codility test page', {
    timeout: 6 * 5000
}, async function () {
    var testPage = new TestPage();

    await testPage.goto();
});
// ===================WHEN===================
When('I click Search button', {
    timeout: 6 * 5000
}, async function () {
    var testPage = new TestPage();

    await testPage.clickSearch();
    await testPage.waitUntilResultsReturned();
});

When('I enter {string} in Search query field', {
    timeout: 6 * 5000
}, async function (searchString) {
    var testPage = new TestPage();

    await testPage.enterSearchString(searchString);
});
// ===================THEN===================
Then('I should see Query Input visible', {
    timeout: 6 * 5000
}, async function () {
    var testPage = new TestPage();
    
    await expect(await testPage.isSearchQueryFieldVisible).to.be.true;
});

Then('I should see Search button visible', {
    timeout: 6 * 5000
}, async function () {
    var testPage = new TestPage();
    
    await expect(await testPage.isSearchButtonVisible).to.be.true;
});

Then('I should see {string} in Results', {
    timeout: 6 * 5000
}, async function (result) {
    var testPage = new TestPage();
    
    await expect(await testPage.isResultFound(result)).to.be.true;
});

Then('Then I should see "Provide some query" error in Results', {
    timeout: 6 * 5000
}, async function () {
    var testPage = new TestPage();
    
    await expect(await testPage.isEmptyErrorFound).to.be.true;
});

Then('I should see at least one result in Results', {
    timeout: 6 * 5000
}, async function () {
    var testPage = new TestPage();
    
    await expect(await testPage.isAtLeastOneResultReturned).to.be.true;
});

Then('I should see "No results" in Results', {
    timeout: 6 * 5000
}, async function () {
    var testPage = new TestPage();
    
    await expect(await testPage.isNoResultsErrorShown).to.be.true;
});

Then('I should see no result returned', {
    timeout: 6 * 5000
}, async function () {
    var testPage = new TestPage();
    
    await expect(await testPage.isNoResultsErrorShown).to.be.true;
});

