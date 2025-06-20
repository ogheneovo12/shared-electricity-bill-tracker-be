import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  config: ConfigService;
  constructor(app: INestApplication<any>) {
    super(app);
    this.config = app.get(ConfigService);
  }

  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      pingInterval: 1000,
      url: `redis://${this.config.get('REDIS_USERNAME')}:${this.config.get('REDIS_PASSWORD')}@${this.config.get('REDIS_HOST')}:${this.config.get('REDIS_PORT')}`,
      socket: {
        connectTimeout: 50000,
      },
    });

    pubClient.on('error', (error) => {
      console.log(error);
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
