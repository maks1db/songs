import { Effect, Option } from 'effect/index';
import { FileSystem, Path } from '@effect/platform';
import { Config } from './config';

export const readFiles = Effect.gen(function* () {
  const path = yield* Path.Path;
  const config = yield* Config;

  const fs = yield* FileSystem.FileSystem;

  if (yield* fs.exists(config.rootDir).pipe(Effect.map((x) => !x))) {
    console.log(config.rootDir);
    return [];
  }

  const files = yield* fs.readDirectory(config.rootDir);

  const ids: number[] = [];
  const parsedSongs = yield* Effect.all(
    files.map((file) =>
      Effect.gen(function* () {
        const pathToFile = path.join(config.rootDir, file);
        const data = yield* fs
          .readFileString(pathToFile, 'utf-8')
          .pipe(Effect.map(songToHTML));
        const params = yield* parseFileName(file);

        const length = ids.filter((x) => x === params.number).length;
        return {
          id:
            length > 0
              ? `${params.number}-${length + 1}`
              : params.number.toString(),
          title: params.title,
          artist: params.artist,
          stringNumber: params.stringNumber,
          song: data,
        };
      }),
    ),
  );

  return parsedSongs;
});

export const parseFileName = (file: string) =>
  Option.gen(function* () {
    const result = yield* Option.fromNullable(/(.*)\.(.*)-(.*)/g.exec(file));

    const [_, number, artist, title] = result.map((x) => x.trim());
    const parsedNumber = Number(number);
    if (Number.isNaN(parsedNumber)) {
      return yield* Option.none();
    }

    const stringNumber = number.padStart(2, '0');

    return { number: parsedNumber, artist, title, stringNumber };
  });

const songToHTML = (song: string) => {
  return song.replaceAll('<>', '<span>').replaceAll('</>', '</span>');
};
