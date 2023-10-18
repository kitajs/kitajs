import { HttpErrors } from '@fastify/sensible';

const maybe = false as boolean;
const array = [1, 2, 3];

export async function get(MYerRORnAMe: HttpErrors) {
  if (maybe) {
    // 503
    throw MYerRORnAMe.serviceUnavailable();
  }

  array.filter((item) => {
    if (item > 4) {
      // 502
      throw MYerRORnAMe.badGateway('Error!');
    }
  });

  //@ts-ignore - should not be added as its a different variable name
  const errors = { gone() {} };
  if (maybe) throw errors.gone();

  // Should not be added as its not a function call
  if (maybe) {
    throw {
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Error 2!'
    };
  }

  //@ts-ignore
  function a() {
    //@ts-ignore
    function a() {
      //@ts-ignore
      function a() {
        //@ts-ignore
        function a() {
          //@ts-ignore
          function a() {
            //@ts-ignore
            function a() {
              //@ts-ignore
              function a() {
                //@ts-ignore
                function a() {
                  //@ts-ignore
                  function a() {
                    //@ts-ignore
                    function a() {}
                  }
                }
              }
            }
          }
          //@ts-ignore
          function a() {
            //@ts-ignore
            function a() {
              //@ts-ignore
              function a() {
                //@ts-ignore
                function a() {
                  //@ts-ignore
                  function a() {
                    //@ts-ignore
                    function a() {
                      // 424
                      throw MYerRORnAMe.failedDependency('Error!');
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return { hello: 'world' };

  // 409
  //@ts-ignore - never executes
  throw MYerRORnAMe.conflict('Error!');
}

/**
 * @throws 403
 * @throws 404
 * @throws 405
 */
export async function post() {
  return { hello: 'world' };
}
