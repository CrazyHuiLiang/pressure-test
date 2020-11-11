const Table = require('cli-table');
const config = require('./config');
const targets = require('./targets');
const {TaskManager} = require('./lib/TaskManager');

const taskManager = new TaskManager(targets, config.thread, config.duration, config.delay);

setInterval(() => {
    console.clear();
    const report = taskManager.report();
    const {total, totalSuccess, totalFail, left, maxTime, minTime, secondSuccessCount, secondFailCount} = report;

    const table = new Table({
        head: ['Total', 'Total Pass', 'Total KO', 'Waiting', 'Max Time', 'Min Time', '1s Pass', '1s Fail'],
        colWidths: [20, 20, 20, 20, 20, 20, 20, 20],
        style: {
            // head: ['white', 'green', 'red', 'yellow', 'white', 'white', 'green', 'red'],
            head: ['white'],
        }
    });
    table.push([total, totalSuccess, totalFail, left, maxTime, minTime, secondSuccessCount, secondFailCount]);
    console.log(table.toString());
}, 1000);

setTimeout(() => process.exit(0), (config.duration + config.delay + 10) * 1000);


