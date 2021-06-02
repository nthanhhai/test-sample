const { browser } = require('protractor');
var BasePage = require('./base_po');

var TestPage = function () {
    BasePage.call(this);

    this.url = browser.params.baseUrl;
    this.searchButton = element(by.css('button#search-button'));
    this.searchQueryField = element(by.css('input#search-input'))
    this.searchReusultContainer = element(by.css('div#output-container'));
    this.searchResultList = element(by.css('ul#search-results'));
    this.searchResults = this.searchResultList.element.all(by.css('li'));
    this.emptyIputError = element(by.css('div#error-empty-query'));
    this.noResultsError = element(by.css('div#error-no-results'));

    this.isSearchButtonVisible = async function() {
        return this.isVisible(this.searchButton, 3000);
    }

    this.isSearchQueryFieldVisible = async function() {
        return this.isVisible(this.searchQueryField, 3000);
    }

    this.clickSearch() = async function() {
        await this.searchButton.click();
    }

    this.isResultFound = async function(result) {
        // need to check for all results?
        let isFound = true;
        let numberOfResult = await this.searchResults.count();
        for (let i = 0; i < numberOfResult; i++) {
            let resultText = await this.searchResults.get(i).getText();
            if (!resultText.includes(result)) {
                isFound = false;
                break;
            }
        }
        return isFound;
    }

    this.isEmptyErrorFoud = async function() {
        return await this.isVisible(this.emptyIputError, 3000);
    }

    this.enterSearchString = async function(searchString) {
        await this.searchQueryField.sendKeys(searchString);
    }

    this.isAtLeastOneResultReturned = async function() {
        let numberOfResult = await this.searchResults.count();
        if (numberOfResult > 0) 
            return true;
        else   
            return false;            
    }

    this.isNoResultsErrorShown = async function() {
        return await this.isVisible(this.noResultsError, 3000);
    }

    this.isNoResultsReturned = async function() {
        let numberOfResult = await this.searchResults.count();
        if (numberOfResult == 0) 
            return true;
        else   
            return false;                    
    }

    this.waitUntilResultsReturned = async function() {
        await browser.wait(await this.waitUntilVisible(this.searchResultList, 100));
    }
};

TestPage.prototype = Object.create(BasePage.prototype);

module.exports = TestPage;