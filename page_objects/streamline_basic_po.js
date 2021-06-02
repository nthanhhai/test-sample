const { browser } = require('protractor');
var BasePage = require('./base_po');

var StreamlineBasic = function () {
    BasePage.call(this);

    this.bannerContent = element(by.cssContainingText('div.banner-content', 'Streamline Basic'));
    this.feesTable = element(by.css('div.table-row-stack'));

    this.pageLoaded = function () {
        return this.isVisible(this.bannerContent)
    };

    this.getFee = async function (accountType) {
        var row = element(by.cssContainingText('div.table-row', accountType));
        var feeCol = row.all(by.css('div.table-row-item')).get(1);
        return await feeCol.getText();
    }

};

StreamlineBasic.prototype = Object.create(BasePage.prototype);

module.exports = StreamlineBasic;