const { browser } = require('protractor');
var BasePage = require('./base_po');

var HomePage = function () {
    BasePage.call(this);

    this.url = browser.params.baseUrl;
    this.cbaLogo = element(by.css('li.commbank-logo'));
    this.bankingTopNav = element(by.cssContainingText('li', 'Banking'));
    this.homeLoansTopNav = element(by.cssContainingText('li', 'Home loans'));
    this.insuranceTopNav = element(by.cssContainingText('li', 'Insurance'));
    this.investingSuperTopNav = element(by.cssContainingText('li', 'Investing & super'));
    this.businessTopNav = element(by.cssContainingText('li', 'Business'));
    this.instutionalTopNav = element(by.cssContainingText('li', 'Instutional'));
    // this.pageLoaded = this.isVisible(this.cbaLogo);
    this.pageLoaded = function () {
        return this.isVisible(this.bankingTopNav)
    };
};

HomePage.prototype = Object.create(BasePage.prototype);

module.exports = HomePage;