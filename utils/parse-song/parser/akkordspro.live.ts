import { Effect, Layer } from 'effect/index';
import { ParseSongError, Parser } from './context';
import { Puppeteer } from './puppeteer';

export const AkkordsProLive = Layer.effect(
  Parser,
  Effect.gen(function* () {
    const puppeteer = yield* Puppeteer;

    return {
      parse: (url: string) =>
        Effect.gen(function* () {
          yield* puppeteer.open(url);

          const titleArtist = yield* puppeteer.get('.entry-title').pipe(
            Effect.flatMap((x) =>
              x
                ? Effect.succeed(x)
                : Effect.fail(
                    new ParseSongError({ message: 'Название не найдено' }),
                  ),
            ),
            Effect.map((x) =>
              x.replace('аккорды на гитаре и текст песни •', ''),
            ),
            Effect.map((x) => x.split(':').map((x) => x.trim())),
            Effect.map(([artist, ...title]) => ({
              title: title.join(':'),
              artist,
            })),
          );

          const data = yield* puppeteer.get('.chords').pipe(
            Effect.flatMap((x) =>
              x
                ? Effect.succeed(x)
                : Effect.fail(
                    new ParseSongError({
                      message: 'Не удалось прочитать текст композиции',
                    }),
                  ),
            ),
            Effect.map((x) =>
              x.replace('Подобрать аккорды без баррэ', '').trim(),
            ),
          );
          return {
            ...titleArtist,
            data,
          };
        }),
    };
  }),
);
