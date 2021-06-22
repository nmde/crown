import fastify, { FastifyInstance } from 'fastify';
import fastifyAuth from 'fastify-auth';
import fastifyBlipp from 'fastify-blipp';
import fastifyCookie from 'fastify-cookie';
import fastifyCors from 'fastify-cors';
import fastifyHelmet from 'fastify-helmet';
import fastifyMultipart from 'fastify-multipart';
import fastifyRateLimit from 'fastify-rate-limit';
import fastifySensible from 'fastify-sensible';
import fastifyStatic from 'fastify-static';
import fastifyTokenize from 'fastify-tokenize';
import helmet from 'helmet';
import { Mutable } from 'type-fest';
import models from './models';

/**
 * Creates & configures the Fastify instance
 *
 * @param {string} authKey The main encryption key
 * @returns {FastifyInstance} The Fastify instance
 */
export default function createApp(authKey: string): FastifyInstance {
  const app = fastify({
    logger: true,
  });

  // Configure fastify-auth
  app.register(fastifyAuth);

  // Configure fastify-blipp
  app.register(fastifyBlipp);

  // Configure fastify-cookie
  app.register(fastifyCookie);

  // Configure fastify-cors
  app.register(fastifyCors, {
    origin: (origin, cb) => {
      if (origin === undefined || /localhost/.test(origin) || /herokuapp\.com/.test(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error('Origin not allowed!'), false);
    },
  });

  // Configure fastify-helmet
  const helmetOptions: Mutable<NonNullable<Parameters<typeof helmet>[0]>> = {};
  if (process.env.NODE_ENV === 'development') {
    // Uses the least secure CSP possible in dev mode to avoid headaches
    helmetOptions.contentSecurityPolicy = {
      directives: {
        connectSrc: ['*', "'unsafe-inline'"],
        defaultSrc: ['*', "'unsafe-inline'", "'unsafe-eval'"],
        frameSrc: ['*'],
        imgSrc: ['*', "'unsafe-inline'"],
        scriptSrc: ['*', "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ['*', "'unsafe-inline'"],
      },
    };
  }
  app.register(fastifyHelmet, helmetOptions);

  // Configure fastify-multipart
  // TODO: set upload size limits
  app.register(fastifyMultipart);

  // Configure fastify-ratelimit
  // TODO: determine reasonable rate limit
  app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Configure fastify-sensible
  app.register(fastifySensible);

  // Configure fastify-static
  app.register(fastifyStatic, {
    prefix: '/public/',
    root: __dirname,
  });

  // Initialize Tokenize
  app.register(fastifyTokenize, {
    fastifyAuth: true,
    fetchAccount: async (id) => {
      const results = await models.User.findOne({
        where: {
          id,
        },
      });
      if (results === null) {
        return {};
      }
      return results.toJSON();
    },
    secret: authKey,
  });

  return app;
}
