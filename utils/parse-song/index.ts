import { FiveLadLive } from './parser/5lad.live';
import { AkkordsProLive } from './parser/akkordspro.live';
import yargs from 'yargs';
import puppeteer from 'puppeteer';

import { parse } from './lib';
import { Effect } from 'effect/index';
import { Puppeteer, PuppeteerInstance } from './parser/puppeteer';

const options = yargs.option('url', {
  describe: 'Ссылка на композицию',
  type: 'string',
}).argv;

// @ts-ignore
const url: string = options.url;
const mapDomains = {
  '5lad.net': FiveLadLive,
  'akkords.pro/': AkkordsProLive,
};

const bootstrap = () => {
  const program = parse(url);

  const mainLive = Object.entries(mapDomains).reduce((acc, [key, live]) => {
    if (url.includes(key) && !acc) {
      return live;
    }

    return acc;
  }, null);

  if (!mainLive) {
    console.error(`Парсинг "${url}" не поддерживается`);
    return;
  }
  const runnable = program.pipe(
    Effect.provide(mainLive),
    Effect.provide(Puppeteer.Default),
    Effect.provideService(PuppeteerInstance, puppeteer),
  );

  Effect.runPromise(runnable);
};

bootstrap();
