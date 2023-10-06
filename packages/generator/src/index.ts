import { mergeDefaults } from '@kitajs/common';
import { KitaWriter } from './writer';

const writer = new KitaWriter(mergeDefaults(), {} as any);

writer.write('index.ts', '/*!\n * Kitajs\n */\nexport * from "./test"');

writer.write('test.ts', 'export function b():number {}');

writer.flush();

console.log(writer);
