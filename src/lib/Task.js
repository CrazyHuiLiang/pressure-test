
exports.Task = class Task {
    constructor(id, taskInfo) {
        this.taskInfo = taskInfo;
        this.id = id;
        // 状态 0未启动 1运行中 2成功 3失败
        this.state = 0;
        this.time = Date.now();
    }

    async run() {
        try {
            this.state = 1;
            const response = await this.taskInfo.req();
            if (this.taskInfo.assert(response)) {
                this.state = 2;
            } else {
                throw new Error('fail');
            }
        } catch (e) {
            this.state = 3;
        }

        return {
            id: this.id,
            time: Date.now() - this.time,
            state: this.state,
        }
    }
}

