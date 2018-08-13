const {app, BrowserWindow} = require('electron');
const ipc = require('electron').ipcMain;
const d3 = require('d3');

global.mainWindow;
var outArray = [];

function createWindow() {
    mainWindow = new BrowserWindow({width: 1920, height: 1080})
    mainWindow.setMenu(null);
    mainWindow.maximize();
    loadCSV();

    mainWindow.loadFile('index.html')
    mainWindow.on('closed', function () {
        mainWindow = null
    });

    mainWindow.webContents.send('ping', outArray);
}

app.commandLine.appendSwitch('remote-debugging-port', '9222');

function getDateLocation() {
    return 0;
}

function getDescLocation() {
    return 1;
}

function getDebitLocation() {
    return 2;
}

function getCreditLocation() {
    return 3;
}

function getTotalLocation() {
    return 4;
}

function addLineToObject(line) {
    outArray.push({
        "Date": line[getDateLocation()],
        "Desc": line[getDescLocation()],
        "Debit": line[getDebitLocation()],
        "Credit": line[getCreditLocation()],
        "Total": line[getTotalLocation()]
    });
}

function loadCSV() {

    var fs = require('fs');
    var parse = require('csv-parse');
    var async = require('async');

    var inputFile = 'transactions.csv';

    var parser = parse({delimiter: ','}, function (err, data) {
        async.eachSeries(data, function (line, callback) {
            // do something with the line
            /*
            * DATE,
            * PAYMENT DESC
            * DEBIT
            * CREDIT
            * TOTAL
            *
            * These are the expected fields we want. In the future they could be under different headings.
            * This tiny change allows it to work with multiple banks as long as it's specified where they are.
            * */

            if (line != undefined) {
                addLineToObject(line);
                callback();
            }
        })
    });
    fs.createReadStream(inputFile).pipe(parser);
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});