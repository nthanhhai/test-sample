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

var StreamlineBasicPage = require('../page_objects/streamline_basic_po');

// ===================GIVEN===================

// ===================WHEN===================

// ===================THEN===================
Then('I should see monthly account fee is Nil', {
    timeout: 6 * 5000
}, async function () {
    var streamlineBasicPage = new StreamlineBasicPage();
    
    await streamlineBasicPage.waitUntilVisible(streamlineBasicPage.feesTable, 3000);
    await expect(await streamlineBasicPage.getFee('Monthly account fee')).to.equal('Nil');
});