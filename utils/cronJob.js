import cron from 'node-cron';

export const cronJob = (fn, interval, options) => {
    if (typeof fn !== 'function') {
        throw new Error('The required type for fn should be a function');
    } else if (!cron.validate(`${interval}`)) {
        throw new Error('Interval should be a valid cron expression');
    } else {
        let task = cron.schedule(
            `${interval}`,
            () => {
                fn();
            },
            options
        );
        return task;
    }
};
