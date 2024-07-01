import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { Rcon } from 'rcon-client';

@Injectable()
export class RconManager implements OnModuleDestroy {
  private readonly logger = new Logger(RconManager.name);
  private connections: Map<string, Rcon> = new Map();

  private async createConnection(
    host: string,
    port: number,
    password: string,
  ): Promise<Rcon> {
    const rcon = new Rcon({ host, port, password });

    rcon.on('end', () => {
      const key = `${host}:${port}`;
      this.logger.warn(`Connection closed for key: ${key}`);
      this.connections.delete(key);
    });

    rcon.on('error', (error: any) => {
      const key = `${host}:${port}`;
      this.logger.error(`RCON connection error for key: ${key}`, error.stack);
      this.connections.delete(key);
      if (error.code === 'ECONNRESET') {
        this.logger.warn(`Connection reset by peer for key: ${key}`);
      }
    });

    await rcon.connect();
    return rcon;
  }

  private async getConnectionWithRetry(
    host: string,
    port: number,
    password: string,
    retries = 3,
  ): Promise<Rcon> {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await this.createConnection(host, port, password);
      } catch (error: any) {
        this.logger.error(
          `Failed to connect RCON (attempt ${attempt + 1} of ${retries}): ${error.message}`,
          error.stack,
        );
        if (attempt < retries - 1) {
          this.logger.log(`Retrying connection...`);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
        } else {
          throw new Error(
            `Failed to connect RCON after ${retries} attempts: ${error.message}`,
          );
        }
      }
    }
    throw new Error('Unreachable code');
  }

  async getConnection(
    host: string,
    port: number,
    password: string,
  ): Promise<Rcon> {
    const key = `${host}:${port}`;

    this.logger.log(`Attempting to get connection for key: ${key}`);
    let rcon = this.connections.get(key);

    if (!rcon) {
      this.logger.log(
        `No existing connection found for key: ${key}, creating new one.`,
      );
      rcon = await this.getConnectionWithRetry(host, port, password);
      this.connections.set(key, rcon);
      this.logger.log(`New connection created and stored for key: ${key}`);
    } else {
      this.logger.log(`Existing connection found for key: ${key}`);
    }

    return rcon;
  }

  async closeConnection(host: string, port: number): Promise<void> {
    const key = `${host}:${port}`;
    const rcon = this.connections.get(key);

    if (rcon) {
      this.logger.log(`Closing connection for key: ${key}`);
      await rcon.end();
      this.connections.delete(key);
      this.logger.log(`Connection closed and removed for key: ${key}`);
    }
  }

  async onModuleDestroy() {
    this.logger.log(`Module is being destroyed, closing all RCON connections.`);
    for (const [key, rcon] of this.connections.entries()) {
      this.logger.log(`Closing connection for key: ${key}`);
      await rcon.end();
      this.connections.delete(key);
    }
  }
}
