import { Effect } from 'effect';

import { readFiles } from './lib';
import { NodeContext } from '@effect/platform-node/index';

export class SongsReader extends Effect.Service<SongsReader>()('SongsReader', {
  effect: () =>
    Effect.gen(function* () {
      const data = yield* readFiles;
      return {
        getList: () =>
          data.map((x) => ({
            title: `${x.artist} - ${x.title}`,
            id: x.id,
            number: x.stringNumber,
          })),

        getById: (id: string) => data.find((x) => x.id === id),
      };
    }),

  dependencies: [NodeContext.layer],
}) {}
