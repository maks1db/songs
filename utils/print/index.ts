import { Console, Data, Effect, Either } from 'effect/index';
import { range } from 'ramda';
import yargs from 'yargs';

const options = yargs
  .option('variant', {
    describe: 'Список страниц',
    type: 'string',
    choices: ['even', 'odd'],
  })
  .option('count', { describe: 'Количество страниц', type: 'number' }).argv;

const bootstrap = () =>
  Either.gen(function* () {
    const count = yield* Either.fromNullable(
      'count' in options ? options.count : null,
      () => new PrintError({ message: 'Параметр count не заполнен' }),
    );
    const variant = yield* Either.fromNullable(
      'variant' in options ? options.variant : null,
      () => new PrintError({ message: 'Параметр variant не заполнен' }),
    );

    const items = range(1, count + 1).reduce<number[]>((acc, num) => {
      if (variant === 'even' && num % 2 === 0) {
        acc.push(num);
      }

      if (variant === 'odd' && num % 2 !== 0) {
        acc.push(num);
      }

      return acc;
    }, []);

    console.log('Страницы к печати:');
    console.log(items.map(String).join(','));
  }).pipe(Effect.runSync);

class PrintError extends Data.TaggedError('PrintError')<{ message: string }> {}

bootstrap();
