jest.mock('node-cron', () => ({
    schedule: jest.fn(),
    validate: jest.fn()
}));

describe('testing cron', () => {
    it('should throw an error when we pass first paramter anything else than function', async () => {
        const { cronJob } = require('utils/cronJob');
        expect(() => {
            cronJob('!function', '* * * * *');
        }).toThrow('The required type for fn should be a function');
    });

    it('should throw an error when we pass second paramter which is invalid cron expression', async () => {
        const { cronJob } = require('utils/cronJob');
        expect(() => {
            cronJob(() => {
                console.log('I am being called using cron.');
            }, '60 * * * *');
        }).toThrow('Interval should be a valid cron expression');
    });

    it('should execute the function  you passed to the cronJob', async () => {
        let spy = jest.spyOn(console, 'log');
        const cron = require('node-cron');
        cron.schedule.mockImplementation((interval, callback) => {
            console.log('callback', callback);
            callback();
        });
        cron.validate.mockReturnValue(true);
        const { cronJob } = require('utils/cronJob');
        cronJob(
            () => {
                console.log('I am being called using cron.');
            },
            '* * * * *',
            {}
        );
        expect(cron.schedule).toBeCalledWith(
            '* * * * *',
            expect.any(Function),
            {}
        );
        expect(spy).toBeCalledWith('I am being called using cron.');
    });
});
