import { Context, Effect } from 'effect/index';
import { PuppeteerNode } from 'puppeteer';
import { ParseSongError } from './context';

export class PuppeteerInstance extends Context.Tag('PuppeteerInstance')<
  PuppeteerInstance,
  PuppeteerNode
>() {}

export class Puppeteer extends Effect.Service<Puppeteer>()('Puppeteer', {
  scoped: Effect.gen(function* () {
    const puppeteer = yield* PuppeteerInstance;

    const browser = yield* Effect.promise(() =>
      puppeteer.launch({ headless: true }),
    );

    const page = yield* Effect.promise(() => browser.newPage());
    yield* Effect.addFinalizer(() => Effect.promise(() => browser.close()));
    return {
      open: (url: string) => {
        return Effect.promise(() => page.goto(url));
      },
      get: (locator: string) =>
        Effect.promise(() => page.$(locator)).pipe(
          Effect.flatMap((x) => {
            if (x === null) {
              return Effect.fail(
                new ParseSongError({ message: `Локатор не найден ${locator}` }),
              );
            }
            return Effect.succeed(x);
          }),
          Effect.flatMap((x) =>
            Effect.promise(() => x.evaluate((x) => x.textContent)),
          ),
        ),
    };
  }),
}) {}
