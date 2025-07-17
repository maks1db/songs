import { Context, Data, Effect } from 'effect/index';
import { PuppeteerNode } from 'puppeteer';

export interface ParserImpl {
  parse: (url: string) => Effect.Effect<Song, ParseSongError, never>;
}

export class Parser extends Context.Tag('Parser')<Parser, ParserImpl>() {}

export class ParseSongError extends Data.TaggedError('ParseSongError')<{
  message: string;
}> {}

export interface Song {
  artist: string;
  title: string;
  data: string;
}
