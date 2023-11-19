import path from 'path';

// this must be done to avoid making the @kitajs/cli install the runtime as a dev dependency only to keep the tests running
process.env.KITA_RUNTIME_PATH = path.resolve(__dirname, '../../runtime/generated');
