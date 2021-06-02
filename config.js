module.exports = {
    paths: {
        actualPdfRootFolder: process.cwd() + "/testData/pdf/actual",
        baselinePdfRootFolder: process.cwd() + "/testData/pdf/baseline",
        actualPngRootFolder: process.cwd() + "/testData/png/actual",
        baselinePngRootFolder: process.cwd() + "/testData/png/baseline",
        diffPngRootFolder: process.cwd() + "/testData/png/diff"
    },
    settings: {
        // imageEngine: 'graphicsMagick',
        density: 100,
        quality: 70,
        tolerance: 0,
        threshold: 0.7
    }
};  