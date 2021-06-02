var cucumberJunit = require('cucumber-junit');
var fs = require('fs');
var os = require('os');
require('dotenv').config()
var filename = require('file-name');
var path = require('path');

var reporter = require('cucumber-html-reporter');

// preparing metadata
const OS_NAME = process.env.OS_NAME || os.type()
const BROWSER_NAME = process.env.BROWSER_NAME || 'Local'
const BROWSER_VERSION = process.env.BROWSER_VERSION || 'Local'
const START_TIME = process.env.START_TIME
const END_TIME = process.env.END_TIME
const AUTOMATION_BUILD_NUMBER = process.env.AUTOMATION_BUILD_NUMBER
var EXECUTED_MODE = ''
BROWSER_VERSION == 'Local' ? EXECUTED_MODE = 'Local' : EXECUTED_MODE = 'Remote'

var options = {
    theme: 'bootstrap',    
    jsonDir: 'reports',
    output: 'reports/TestResults.html',
    reportSuiteAsScenarios: true,
    launchReport: false,
    ignoreBadJsonFile: true,
    metadata: {
        "Automation Build Numbder": AUTOMATION_BUILD_NUMBER,
        "Browser Name": BROWSER_NAME,
        "Browser Version": BROWSER_VERSION,
        "Platform": OS_NAME,
        "Start Time": START_TIME,
        "End Time": END_TIME,
        "Executed": EXECUTED_MODE
    }
}; 

function createXMLResult() {
    var directoryName = "reports";
    var filenames = fs.readdirSync(directoryName);
    var xmlDir = './reports/XML';
    if (!fs.existsSync(xmlDir)){
        fs.mkdirSync(xmlDir);
    }
    filenames.forEach((file) => {
        if (file.includes('.json')) {
            // read file content
            rawData = fs.readFileSync(path.join(__dirname, directoryName, file));
            var parsedJSON = JSON.parse(rawData);
            var data = JSON.stringify(parsedJSON);
            var xml = cucumberJunit(data, {strict: true});          
            var xmlFileName = filename(file) + '.xml';
            fs.writeFile(path.join(xmlDir, xmlFileName), new Buffer(xml), (err) => {
                if (err) throw err;
                console.log('The JUnit test results ' + xmlFileName + ' file has been saved!');
            });
        };
    });
};

createXMLResult();
reporter.generate(options);