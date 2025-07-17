import { Effect } from 'effect/index';
import { Parser } from './parser/context';
import { FileSystem } from '@effect/platform/index';
import { Path } from '@effect/platform/Path';
import { NodeContext } from '@effect/platform-node/index';

export const parse = (url: string) =>
  Effect.gen(function* () {
    const parser = yield* Parser;
    const song = yield* parser.parse(url);

    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path;

    const dir = path.join(__dirname, '..', '..', 'songs');

    const files = yield* fs.readDirectory(dir);

    const maxNumber =
      files
        .map((x) => x.split('.')[0])
        .map(Number)
        .filter((x) => !Number.isNaN(x))
        .reduce((acc, x) => {
          if (x > acc) {
            return x;
          }
          return acc;
        }, 0) + 1;

    const name = `${maxNumber.toString().padStart(2, '0')}. ${song.artist} - ${song.title}`;

    yield* fs.writeFileString(path.join(dir, name), song.data);
  }).pipe(Effect.provide(NodeContext.layer));
