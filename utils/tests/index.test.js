import moment from 'moment';
import { TIMESTAMP } from 'utils/constants';

import { stringifyWithCheck } from 'utils';

describe('util tests', () => {
    describe('getEnv', () => {
        it('should return the environment that is passed as a string', () => {
            const environments = {
                production: 'production',
                qa: 'qa',
                staging: 'staging',
                development: 'development'
            };
            const { getEnv } = require('utils');
            process.env.NODE_ENV = environments.production;
            const productionEnv = getEnv();
            expect(productionEnv).toEqual(environments.production);
            process.env.NODE_ENV = environments.qa;
            const qaEnv = getEnv();
            expect(qaEnv).toEqual(environments.qa);
            process.env.NODE_ENV = environments.staging;
            const stagingEnv = getEnv();
            expect(stagingEnv).toEqual(environments.staging);
            process.env.NODE_ENV = 'TEST';
            const defaultEnv = getEnv();
            expect(defaultEnv).toEqual(environments.development);
        });
    });

    describe('formatWithTimestamp', () => {
        it('should format the provided moment', () => {
            const now = moment();
            const nowFormatted = moment().format(TIMESTAMP);
            const { formatWithTimestamp } = require('utils');
            const nowFormattedTest = formatWithTimestamp(now);
            expect(nowFormatted).toEqual(nowFormattedTest);
        });
    });

    describe('strippedUUID', () => {
        it('should return a uuid with no `-` ', () => {
            const { strippedUUID } = require('utils');
            const uuId = strippedUUID();
            expect(uuId).toEqual(expect.not.stringMatching(/-/g));
        });
    });
});
describe('winston logger tests', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.mock('winston', () => {
            const mockFormat = {
                combine: jest.fn(),
                timestamp: jest.fn(),
                errors: jest.fn(),
                printf: jest.fn()
            };
            const mockTransports = {
                Console: jest.fn()
            };
            const mockLogger = {
                info: jest.fn(),
                add: jest.fn()
            };
            return {
                format: mockFormat,
                transports: mockTransports,
                createLogger: jest.fn(() => mockLogger)
            };
        });
    });

    it('should run mocked winston test', () => {
        const { format } = require('winston');

        let mockedFn;
        format.printf.mockImplementation(templateFn => {
            mockedFn = templateFn;
        });

        const { logger } = require('../index');

        //invoke the logger.
        logger().info('Mocking');

        const info = {
            timestamp: 123,
            message: 'mock log'
        };
        const formatrTracerMock = mockedFn;
        expect(formatrTracerMock(info)).toBe(
            `${info.timestamp}: ${JSON.stringify(info.message)} {}`
        );
    });

    it('should add request trace', () => {
        jest.mock('cls-rtracer', () => {
            const rTracer = {
                id: jest.fn().mockReturnValue(7)
            };
            return rTracer;
        });

        const { format } = require('winston');

        let mockedFn;
        format.printf.mockImplementation(templateFn => {
            mockedFn = templateFn;
        });

        const { logger } = require('../index');
        logger().info('Mocking');

        const info = {
            timestamp: 123,
            message: 'mock log'
        };
        const tFn1 = mockedFn;
        // mockedrTracerId
        expect(tFn1(info)).toBe(
            `${info.timestamp} [request-id:7]: ${JSON.stringify(
                info.message
            )} {}`
        );
    });
});
describe('stringifyWithCheck', () => {
    it('should return the strigified message', () => {
        const obj = { a: 'b' };
        const res = stringifyWithCheck(obj);
        expect(res).toBe(JSON.stringify(obj));
    });
    it('should not throw an error if its not able to stringify the object', () => {
        const obj = { a: 'b' };
        obj.obj = obj;
        const res = stringifyWithCheck(obj);
        expect(res).toBe('unable to unfurl message: [object Object]');
    });

    it('should stringify the data key if present in the message and unable to stringify the original value', () => {
        const obj = { a: 'b' };
        obj.obj = obj;
        obj.data = { body: 'This is the real answer' };
        const res = stringifyWithCheck(obj);
        expect(res).toBe(JSON.stringify(obj.data));
    });
});
