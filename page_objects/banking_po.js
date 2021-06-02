const { browser } = require('protractor');
var BasePage = require('./base_po');

var Banking = function () {
    BasePage.call(this);

    this.bankingBanner = element(by.cssContainingText('div.banner-content', 'Banking'));
    this.everydayAccountsNav = element(by.css('a[title=\'Everyday accounts\']'));
 
    this.pageLoaded = function () {
        return this.isVisible(this.bankingBanner);      
    };
};

Banking.prototype = Object.create(BasePage.prototype);

module.exports = Banking;