export function post(a: 'not a kita parameter' /* ParameterResolverNotFoundError */) {
  return a;
}

// No errors should be thrown for this method
export function get() {}
