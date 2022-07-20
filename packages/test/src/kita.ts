import { kita, CustomParameter } from '@kita/runtime';

export type AuthParam = CustomParameter<'authentication'>;

export default kita({
  parameterResolvers: {
    AuthParam(req, rep, parameters): AuthParam {
      return 'authentication';
    }
  }
});
