export interface H2 {
  a: 1;
}

export default function (): H2 {
  return { a: 1 };
}

export async function onRequest() {
  return;
}
