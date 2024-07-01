import { Injectable, Logger } from '@nestjs/common';
import { RconManager } from './rcon.manager';

@Injectable()
export class RconService {
  private readonly logger = new Logger(RconService.name);

  constructor(private readonly rconManager: RconManager) {}

  async sendCommand(
    host: string,
    port: number,
    password: string,
    command: string,
  ): Promise<string> {
    let rcon;
    try {
      rcon = await this.rconManager.getConnection(host, port, password);
    } catch (error: any) {
      this.logger.error(
        `Failed to get RCON connection: ${error.message}`,
        error.stack,
      );
      throw error;
    }

    try {
      this.logger.log(`Sending command: ${command} to ${host}:${port}`);
      const response = await rcon.send(command);
      this.logger.log(`Received response: ${response}`);
      return response;
    } catch (error: any) {
      this.logger.error(
        `Failed to send RCON command: ${error.message}`,
        error.stack,
      );
      if (error.code === 'ECONNRESET') {
        this.logger.warn(
          `Connection reset by peer, attempting to reconnect...`,
        );
        await this.rconManager.closeConnection(host, port);
        // 重试连接和命令
        try {
          rcon = await this.rconManager.getConnection(host, port, password);
          const response = await rcon.send(command);
          this.logger.log(`Received response after reconnect: ${response}`);
          return response;
        } catch (reconnectError: any) {
          this.logger.error(
            `Failed to reconnect RCON: ${reconnectError.message}`,
            reconnectError.stack,
          );
          throw reconnectError;
        }
      }
      throw error;
    }
  }
}
