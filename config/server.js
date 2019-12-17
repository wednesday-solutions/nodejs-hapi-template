import Qs from 'qs';
import semver from 'semver';

import pkg from '../package';

const __version = semver(pkg.version);

export default {
    app: {
        name: pkg.name,
        docs: pkg.homepage,
        version: pkg.version,
        semver: {
            major: __version.major,
            minor: __version.minor,
            patch: __version.patch
        },
        env: `${
            process.env.NODE_ENV === 'production' ? 'production' : 'development'
        }`
    },
    host: '0.0.0.0',
    port: process.env.PORT,
    routes: {
        validate: {
            options: {
                abortEarly: false
            },
            failAction: (request, h, err) => {
                throw err;
            }
        }
    },
    query: {
        parser: query => Qs.parse(query)
    },
    router: {
        isCaseSensitive: false,
        stripTrailingSlash: true
    }
};
