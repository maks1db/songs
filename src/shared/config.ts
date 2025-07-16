import { Context } from 'effect/index';

interface ConfigImpl {
  rootDir: string;
}

export class Config extends Context.Tag('Config')<Config, ConfigImpl>() {}
