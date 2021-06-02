const { browser } = require('protractor');
var BasePage = require('./base_po');

var EverdayAccounts = function () {
    BasePage.call(this);

    this.bannerContent = element(by.cssContainingText('div.banner-content', 'Everyday accounts'));
    this.cardSection = element(by.css('div.card-section'));
    this.accountTypes = element.all(by.css('div.carditem'));
    this.concessionCard = element(by.cssContainingText('div.card-container', 'Concession card holders'));
    this.tellMeHowConcessionCard = this.concessionCard.element(by.cssContainingText('div.card-cta', 'Tell me how'));
    
    this.pageLoaded = function () {
        return this.isVisible(this.bannerContent)
    };

    this.getNumberOfAccountType = async function() {
        await this.waitUntilVisible(this.cardSection, 3000);
        await this.scrollIntoView(this.cardSection);
        return await this.accountTypes.count();
    };
};

EverdayAccounts.prototype = Object.create(BasePage.prototype);

module.exports = EverdayAccounts;