/* eslint-disable import/no-mutable-exports */
import devConfig from './development';
// import testConfig from './test';

const config = devConfig;

// switch (process.env.NODE_ENV) {
//   case 'development':
//     config = devConfig;
//     break;
//   case 'test':
//     config = testConfig;
//     break;
//   default:
//     config = devConfig;
// }

export default config;
