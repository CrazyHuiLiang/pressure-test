const {Task} = require('./Task');
const {v4: uuidV4} = require('uuid');

exports.TaskManager = class TaskManager {
    constructor(targets, thread, duration, delay) {
        this.targets = targets;
        this.thread = thread;
        this.duration = duration;

        this.tasks = {};
        this.totalLeft = 0;
        this.totalSuccess = 0;
        this.totalFail = 0;
        this.maxTime = 0;
        this.minTime = Infinity;

        this.secondSuccessCount = 0;
        this.secondFailCount = 0;
        setTimeout(() => this.createTasks(), 1000 * delay);
    }

    // 创建任务
    createTasks() {
        if (!this.duration) {
            return ;
        }
        this.secondSuccessCount = 0;
        this.secondFailCount = 0;

        for (let i = 0; i< this.thread; i++) {
            this.targets.forEach(async (target) => {
                const uuid = uuidV4();
                const task = new Task(uuid, target);
                this.tasks[uuid] = task;
                this.totalLeft++;
                task.run().then((result) => this.parse(result));
            })
        }
        setTimeout(() => this.createTasks(), 1000);
        this.duration--;
    }

    // 解析任务结果
    parse(taskResult) {
        delete this.tasks[taskResult.id];
        this.totalLeft--;
        // 最长时间
        if (this.maxTime < taskResult.time) {
            this.maxTime = taskResult.time;
        }
        if (taskResult.state === 2) {
            this.parseSuccess(taskResult);
        } else if (taskResult.state === 3) {
            this.parseFail(taskResult);
        }
    };
    // 解析成功结果
    parseSuccess(taskResult) {
        this.totalSuccess++;
        this.secondSuccessCount++;

        // 最短耗时
        if (taskResult.time < this.minTime) {
            this.minTime = taskResult.time;
        }
    };

    // 解析失败结果
    parseFail(taskResult) {
        this.totalFail++;
        this.secondFailCount++;
    };

    // 汇报任务状态
    report() {
        return {
            total: this.totalLeft + this.totalSuccess + this.totalFail, // 总任务量
            left: this.totalLeft, // 剩余任务量
            totalSuccess: this.totalSuccess, // 总成功数量
            totalFail: this.totalFail, // 总失败数量
            maxTime: this.maxTime,
            minTime: this.minTime,

            secondSuccessCount: this.secondSuccessCount,// 1s内
            secondFailCount: this.secondFailCount, // 1s内失败量
        }
    }
}

