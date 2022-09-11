type KitaError = {
  __KITA_ERROR__: true;
  message: string;
  [key: string]: any;
};

export function KitaError(message: string, path: string): KitaError;
export function KitaError(message: string, additional?: Record<string, any>): KitaError;
export function KitaError(
  message: string,
  path: string,
  additional?: Record<string, any>
): KitaError;
export function KitaError(
  message: string,
  additionalOrPath?: Record<string, any> | string,
  additional?: Record<string, any>
): KitaError {
  return {
    __KITA_ERROR__: true,
    message:
      typeof additionalOrPath === 'string'
        ? `${message}\n  at ${additionalOrPath}`
        : message,
    ...(typeof additionalOrPath === 'object' ? additionalOrPath : {}),
    ...additional
  } as const;
}

export function isKitaError(error: any): error is KitaError {
  return !!error?.__KITA_ERROR__;
}

export const catchKitaError = (err: any) => {
  if (isKitaError(err)) {
    const { __KITA_ERROR__, message, ...rest } = err;
    console.log(`\n ❌   ${message}`);

    if (Object.keys(rest).length > 0) {
      console.log(rest);
    }
  } else {
    console.error('\n ❌   Error while generating code.');
    console.error(err);
  }

  return undefined;
};
