import { app } from './app';
import { NodeRuntime } from '@effect/platform-node';
import { NodeServer } from 'effect-http-node';

function bootstrap() {
  app.pipe(NodeServer.listen({ port: 3000 }), NodeRuntime.runMain);
}

bootstrap();
