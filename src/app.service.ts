import { Injectable } from '@nestjs/common';
import { Effect, Layer, ManagedRuntime } from 'effect/index';
import { SongsReader } from './shared/reader';
import { Config } from './shared/config';
import { join } from 'path';
import { NoSuchElementException } from 'effect/Cause';
import { PlatformError } from '@effect/platform/Error';

@Injectable()
export class AppService {
  runtime: ManagedRuntime.ManagedRuntime<
    SongsReader | Config,
    PlatformError | NoSuchElementException
  >;

  constructor() {
    console.log(join(__dirname, '..', '..', 'songs'));
    const MainLive = Layer.mergeAll(SongsReader.Default()).pipe(
      Layer.provideMerge(
        Layer.succeed(Config, {
          rootDir: join(__dirname, '..', '..', 'songs'),
        }),
      ),
    );

    this.runtime = ManagedRuntime.make(MainLive);
  }

  getSongsList() {
    const program = Effect.gen(function* () {
      const reader = yield* SongsReader;
      const result = reader.getList();

      return result;
    });
    return this.runtime.runPromise(program);
  }

  getById(id: string) {
    const program = Effect.gen(function* () {
      const reader = yield* SongsReader;
      const result = reader.getById(id);

      return result;
    });
    return this.runtime.runPromise(program);
  }

  getAll() {
    const program = Effect.gen(function* () {
      const reader = yield* SongsReader;
      const result = reader.getAll();

      return result;
    });
    return this.runtime.runPromise(program);
  }
}
