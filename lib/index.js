const Table = require('cli-table');
const config = require('../test/config');
const targets = require('../test/targets');
const {TaskManager} = require('../lib/TaskManager');

const taskManager = new TaskManager(targets, config.thread, config.duration, config.delay);

let time = 0;
setInterval(() => {
    time++;
    let finish = false;
    console.clear();
    const report = taskManager.report();
    const {total, totalSuccess, totalFail, left, maxTime, minTime, secondSuccessCount, secondFailCount} = report;
    let option = {
        head: ['Total', 'Total Pass', 'Total KO', 'KO %', 'Waiting', 'Max Time', 'Min Time', '1s Pass', '1s Fail'],
        colWidths: [15, 15, 10, 10, 10, 10, 10, 10, 10],
        style: {
            // head: ['white', 'green', 'red', 'yellow', 'white', 'white', 'green', 'red'],
            head: ['white'],
        }
    };

    if (time < config.delay) {
        console.log('等待加压: ', time, 's');
    } else if (time < (config.delay + config.duration)) {
        option.style.head = ['red'];
        console.log('持续压测中:', time - config.delay, 's');
    } else if (report.left !== 0){
        option.style.head = ['yellow'];
        console.log('压测已结束,等待所有任务结束:', time - config.delay - config.duration, 's');
    } else {
        option.style.head = ['green'];
        console.log(`压测已结束, 共加压：${config.duration} s \n所有任务共耗时:${time - config.delay} s`);
        finish = true;
    }

    const table = new Table(option);
    table.push([total, totalSuccess, totalFail, `${(totalFail/total * 100).toFixed(2)}%`, left, maxTime, minTime, secondSuccessCount, secondFailCount]);
    console.log(table.toString());
    finish && process.exit(0);
}, 1000);



