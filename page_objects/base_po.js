const { browser } = require("protractor");
const EC = protractor.ExpectedConditions;
const config = require("../config");
const fs = require("fs");
const path = require("path");
const comparePdf = require("compare-pdf");
const url = require('url');

var BasePage = function () {
    this.loaded = async function () {
        if ((typeof this.pageLoaded) === 'function')
        {
            return await browser.wait(await this.pageLoaded(), 30000, 'timeout: waiting for page to load. The url is: ' + this.url);
        }
        else {
            return true;
        }        
    };

    this.goto = async function () {
        await browser.get(this.url, 30000);
        console.log('Current URL: ' + this.url);
        return await this.loaded();
    };

    this.clearCookiesAndGoto = async function () {
        await browser.get(this.url, 30000);
        await browser.executeScript('window.sessionStorage.clear();');
        await browser.executeScript('window.localStorage.clear();');
        await browser.driver.manage().deleteAllCookies();
        console.log('Cookies cleared');
        await browser.get(this.url, 30000);
        console.log('Current URL: ' + this.url);
        return await this.loaded();
    };

    this.isVisible = async function (locator) {
        return await EC.visibilityOf(locator);
    };

    this.isNotVisible = async function (locator) {
        return await EC.invisibilityOf(locator);
    };

    this.inDOM = async function (locator) {
        return await EC.presenceOf(locator);
    };

    this.notInDOM = function (locator) {
        return EC.stalenessOf(locator);
    };

    this.isClickable = async function (locator) {
        return await EC.elementToBeClickable(locator);
    };

    this.hasText = async function (locator, text) {
        return await EC.textToBePresentInElement(locator, text);
    };

    this.and = async function (functions) {
        return await EC.and(functions);
    };

    this.titleIs = async function (title) {
        return await EC.titleIs(title);
    };

    this.titleContains = async function (text) {
        return await EC.titleContains(text);
    };

    this.urlIs = async function (url) {
        return await EC.urlIs(url);
    }

    this.urlContains = async function (text) {
        return await EC.urlContains(text);
    };

    this.pressEnter = async function () {
        return await browser.actions().sendKeys(protractor.Key.ENTER).perform();
    };

    this.waitForPageLoaded = async function () {
        await browser.wait(await EC.not(await EC.visibilityOf($('div.loading-image'))), 15000);
    };

    this.waitUntil = async function(condition, message, timeout) {
        await browser.wait(condition, (timeout * 1000) || browser.allScriptsTimeout, message);
    };
      
    this.waitUntilVisible = async function (element, timeout) {
        return await this.waitUntil(
            await EC.visibilityOf(element),
            'Time out waiting for element ' + element.locator(), timeout);
    };

    this.waitUntilInvisible = async function (element, timeout) {
        return await this.waitUntil(
            await EC.not(EC.visibilityOf(element)),
            'Time out waiting for element ' + element.locator(), timeout);
    };  

    this.waitUntilClickable = async function (element, timeout) {
        return await this.waitUntil(
            await EC.elementToBeClickable(element),
            'Time out waiting for element ' + element.locator(), timeout);
    };   
    
    this.clickAndWait = async function (element) {
        console.log('Clicking \"' + await element.getText() + '\" button');
        await element.click();        
        return await this.waitForPageLoaded();
    };

    this.clearCookies = async function () {
        await browser.driver.manage().deleteAllCookies();
    };

    this.scrollIntoView = async function (element) {
        await browser.executeScript('arguments[0].scrollIntoView()', element);
    }

    this.scrollDropDownUntilVisible = async function (dropdown, element) {
        let y_coord = 0;
        while (!await element.isPresent()) {
            y_coord += 100;
            await browser.executeScript('arguments[0].scrollTo(0, 100)', dropdown.getWebElement());
        }        
    };

    this.highlightElement = function(el){
        console.log("highlight--");
      
        console.log("locator---:"+el.locator());
      
        return browser.driver.executeScript("arguments[0].setAttribute('style', arguments[1]);",el.getWebElement(), "color: Red; border: 2px solid red;").
        then(function(resp){
          browser.sleep(2000);
          return el;
        },function(err){
          console.log("error is :"+err);
        });
    };

    this.numberWithCommas = function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    this.nthIndex = function(str, searchString, n) {
        var L= str.length, i= -1;
        while(n-- && i++<L){
            i= str.indexOf(searchString, i);
        }
        return i;
    };

    this.scrollAndClick = async function(element) {
        await this.scrollIntoView(element);
        await element.click();
    };

    this.comparePdf = async function(actualPdf, baselinePdf, masks) {
        console.log('Start comparing...');
        try {
            let comparisonResults = await new comparePdf(config)
                .actualPdfFile(actualPdf)
                .baselinePdfFile(baselinePdf)
                .addMask(masks)  
                .compare();
            return comparisonResults.status;
        } catch (e) {
            console.log('error when comparing: ' + e.message);
        }
    };

    this.getDiffResultBase64 = async function() {
        let diffChildFolder = path.basename(browser.params.downloadedPdf).split('.')[0];
        let diffResult = path.join(config.paths.diffPngRootFolder, diffChildFolder, diffChildFolder + "_diff.png");
        return await this.base64_encode(diffResult);
    };

    this.getDownloadedFile = async function(fileName) {        
        let isFileDownloaded = false;
        console.log('Getting download file');
        let script = 'browserstack_executor: {"action": "getFileContent", "arguments": {"fileName": "' + fileName + '"}}';
        let actualFilePath = path.join(config.paths.actualPdfRootFolder, browser.params.campaignName);
        try {
            do {
                isFileDownloaded = await browser.executeScript('browserstack_executor: {"action": "fileExists", "arguments": {"fileName": "' + fileName + '"}}');                 
            } while (isFileDownloaded);
            await browser.sleep(1000);
            let data = await browser.executeScript(script);
            console.log('Browserstack get file script finished. Start writing...');
            await fs.writeFile(actualFilePath, data, 'base64', function (err) {
                if (err) throw err;
                console.log('File created')
            });
        } catch (e) {
            console.log('Download file error: ' + e.message);
        }
        await browser.sleep(5000); // wait for the file written
        return actualFilePath;
    };

    this.getCampaignID = async function(){
        let campaignUrl = url.parse(await browser.getCurrentUrl(), true);
        return campaignUrl.pathname.split('/')[2];        
    };

    this.base64_encode = async function(file) {
        // read binary data
        console.log('reading file: ' + file);
        console.log('Converting to base64...');
        try {
            console.log('file to encode: ' + file);
            return fs.readFileSync(file, { encoding: 'base64' });            
        } catch (e) {
            console.log('error message: ' + e);
            throw new Error('converting to base64 failed.')
        }
    };

    Date.prototype.addDays = function(days) {
        var result = new Date(this);
        result.setDate(this.getDate() + parseInt(days));
        return result;
    };    
};

module.exports = BasePage;