type KitaError = {
  __KITA_ERROR__: true;
  message: string;
  [key: string]: any;
};

export function KitaError(message: string, path: string | string[]): KitaError;
export function KitaError(message: string, additional?: Record<string, any>): KitaError;
export function KitaError(
  message: string,
  path: string | string[],
  additional?: Record<string, any>
): KitaError;
export function KitaError(
  message: string,
  additionalOrPath?: Record<string, any> | string | string[],
  additional?: Record<string, any>
): KitaError {
  return {
    __KITA_ERROR__: true,
    message:
      typeof additionalOrPath === 'string'
        ? `${message}\n  at ${additionalOrPath}`
        : Array.isArray(additionalOrPath)
        ? `${message}\n  at ${additionalOrPath.join('\n and ')}`
        : message,

    ...(typeof additionalOrPath === 'object' && !Array.isArray(additionalOrPath)
      ? additionalOrPath
      : {}),

    ...additional
  } as const;
}

export function isKitaError(error: any): error is KitaError {
  return !!error?.__KITA_ERROR__;
}

/** Used to keep track of the amount of thrown errors happened during this whole process execution. */
export let errorCount = 0;

export const catchKitaError = (err: any) => {
  // Error counting is done on catch blocks because some errors may have been caught and handled.
  errorCount += 1;

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
