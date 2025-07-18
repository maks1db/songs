import { Effect, Option } from 'effect';

import { makeTitle, readFiles } from './lib';
import { NodeContext } from '@effect/platform-node/index';

export class SongsReader extends Effect.Service<SongsReader>()('SongsReader', {
  effect: () =>
    Effect.gen(function* () {
      const data = yield* readFiles;
      return {
        getList: () =>
          data.map((x) => ({
            title: makeTitle(x.stringNumber, x.artist, x.title),
            id: x.id,
            number: x.stringNumber,
          })),

        getAll: () =>
          data.map((x) => ({
            ...x,
            titleSong: makeTitle(x.stringNumber, x.artist, x.title),
          })),

        getById: (id: string) =>
          Option.gen(function* () {
            const item = yield* Option.fromNullable(
              data.find((x) => x.id === id),
            );

            return {
              ...item,
              titleSong: makeTitle(item.stringNumber, item.artist, item.title),
            };
          }).pipe(Option.getOrNull),
      };
    }),

  dependencies: [NodeContext.layer],
}) {}
