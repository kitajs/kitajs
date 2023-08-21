import { kFastifyParam, kReplyParam, kRequestParam } from '../constants';
import type { BaseParameter } from '../models';

export class FastifyParameter implements BaseParameter {
  value: string;
  helper?: string | undefined;

  constructor(typeName: string) {
    switch (typeName) {
      case 'FastifyRequest':
        this.value = kRequestParam;
        break;

      case 'FastifyReply':
        this.value = kReplyParam;
        break;

      case 'FastifyInstance':
        this.value = kFastifyParam;
        break;
    }
  }
}
