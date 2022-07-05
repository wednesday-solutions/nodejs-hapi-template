import { v4 as uuidv4 } from 'uuid';
import { TIMESTAMP } from './constants';
import { createLogger, format, transports } from 'winston';
import rTracer from 'cls-rtracer';

const { combine, timestamp, printf } = format;

export const getEnv = () => {
    switch (process.env.NODE_ENV) {
        case 'production':
            return 'production';
        case 'qa':
            return 'qa';
        case 'staging':
            return 'staging';
        default:
            return 'development';
    }
};

export const formatWithTimestamp = date =>
    date ? date.format(TIMESTAMP) : null;

export const strippedUUID = () => uuidv4().replace(/-/g, '');
/**
 * checks if this token belongs to an ADMIN
 * @date 2020-03-21
 * @param {any} token
 * @returns {any}
 */

export const stringifyWithCheck = message => {
    try {
        return JSON.stringify(message);
    } catch (err) {
        if (message.data) {
            return stringifyWithCheck(message.data);
        } else {
            console.log(message);
            return `unable to unfurl message: ${message}`;
        }
    }
};
export const logger = () => {
    const rTracerFormat = printf(info => {
        const rid = rTracer.id();
        const infoSplat = info[Symbol.for('splat')] || [];
        const infoSplatObject = { ...infoSplat };
        return rid
            ? `${info.timestamp} [request-id:${rid}]: ${stringifyWithCheck(
                  info.message
              )} ${stringifyWithCheck(infoSplatObject)}`
            : `${info.timestamp}: ${stringifyWithCheck(
                  info.message
              )} ${stringifyWithCheck(infoSplatObject)}`;
    });
    return createLogger({
        format: combine(timestamp(), rTracerFormat),
        transports: [new transports.Console()]
    });
};
