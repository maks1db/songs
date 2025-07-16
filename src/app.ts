import { Effect, Schema } from 'effect';
import { Api, QuerySchema, RouterBuilder } from 'effect-http';

const UserResponse = Schema.Struct({
  name: Schema.String,
  id: Schema.Int.pipe(Schema.positive()),
});
const GetUserQuery = Schema.Struct({ id: QuerySchema.Number });

const api = Api.make({ title: 'Users API' }).pipe(
  Api.addEndpoint(
    Api.get('getUser', '/user').pipe(
      Api.setResponseBody(UserResponse),
      Api.setRequestQuery(GetUserQuery),
    ),
  ),
);

export const app = RouterBuilder.make(api).pipe(
  RouterBuilder.handle('getUser', ({ query }) =>
    Effect.succeed({ name: 'milan', id: query.id }),
  ),
  RouterBuilder.build,
);
