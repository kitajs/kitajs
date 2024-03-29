// Loads .env file into process.env
import 'dotenv/config';

// This tells kita where to find the root of your project
globalThis.KITA_PROJECT_ROOT ??= __dirname;
