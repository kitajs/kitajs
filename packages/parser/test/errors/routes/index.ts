import { HttpErrors } from '@fastify/sensible';

const maybe = false as boolean;
const array = [1, 2, 3];

export async function get(MYerRORnAMe: HttpErrors) {
  if (maybe) {
    throw MYerRORnAMe.serviceUnavailable(); // 503
  }

  array.filter((item) => {
    if (item > 4) {
      throw MYerRORnAMe.badGateway('Error!'); // 502
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
      function c() {
        //@ts-ignore
        function d() {
          //@ts-ignore
          function e() {
            //@ts-ignore
            function f() {
              //@ts-ignore
              function g() {
                //@ts-ignore
                function h() {
                  //@ts-ignore
                  function i() {
                    //@ts-ignore
                    function j() {}
                  }
                }
              }
            }
          }
          //@ts-ignore
          function k() {
            //@ts-ignore
            function l() {
              //@ts-ignore
              function m() {
                //@ts-ignore
                function n() {
                  //@ts-ignore
                  function o() {
                    //@ts-ignore
                    function p() {
                      throw MYerRORnAMe.failedDependency('Error!'); // 424
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

  //@ts-ignore - never executes
  throw MYerRORnAMe.conflict('Error!'); //409
}

/**
 * @throws 403
 * @throws 404
 * @throws 405, 406
 */
export async function post() {
  return { hello: 'world' };
}
