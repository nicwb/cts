// This file can be replaced during build by using the fileReplacements array.
// ng build replaces environment.ts with environment.prod.ts.
// The list of file replacements can be found in angular.json.

export const environment = {
    appVersion: require('../../package.json').version,
    version: 'v1',
    production: process.env['NG_APP_ENV']?.includes('production') ?? false,
    BaseURL: process.env['NG_APP_API_BASE_URL'] + '/api/', //'http://api.docker.test/api/',
    OpenApiBaseURL: process.env['NG_APP_API_BASE_URL'], //'http://api.docker.test',
    refreshTokenUrl: '/authapi/api/Auth/refresh-token',
    authUrl: 'http://localhost:4203/login',
    accessTokenKey: 'IFMS3-CTS-jwtToken',
    refeshTokenKey: 'IFMS3-CTS-jwtRefreshToken',
    //   BaseURL:'https://localhost:7249/api/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as zone.run, zoneDelegate.invokeTask.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
