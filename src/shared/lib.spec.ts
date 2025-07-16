import { Option } from 'effect/index';
import { parseFileName } from './lib';

describe('lib', () => {
  it('parseFileName', () => {
    expect(
      parseFileName('1. Король и шут - Камнем по голове').pipe(
        Option.getOrNull,
      ),
    ).toEqual({
      artist: 'Король и шут',
      number: 1,
      stringNumber: '01',
      title: 'Камнем по голове',
    });
  });
});
