// 3rd party dependencies
import { QuickDB } from 'quick.db';

// local dependencies
import config from './config.json';

/**
 * The database instance
 * */
export const db = new QuickDB({ filePath: config.database.path });