import { ConnResolver } from './conn';
import { ParamResolver } from './base';
import { ThisResolver } from './this';
import { SockResolver } from './sock';
import { PathResolver } from './path';
import { CookieResolver } from './cookie';
import { BodyResolver } from './body';
import { BodyPropResolver } from './body-prop';
import { QueryResolver } from './query';
import { HeaderResolver } from './header';
import { ReqResolver } from './req';
import { RepResolver } from './rep';
import { CustomResolver } from './custom';

// Avoids duplicate imports
if (ParamResolver.resolvers.length === 0) {
  ParamResolver.resolvers.push(
    new ThisResolver(),
    new SockResolver(),
    new ConnResolver(),
    new PathResolver(),
    new CookieResolver(),
    new BodyResolver(),
    new BodyPropResolver(),
    new QueryResolver(),
    new HeaderResolver(),
    new ReqResolver(),
    new RepResolver(),
    new CustomResolver()
  );
}
