import { PropsWithChildren } from '@kitajs/html';

export function Layout({ children }: PropsWithChildren) {
  return (
    <>
      {'<!DOCTYPE html>'}
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>KitaJS</title>
        </head>
        <body>{children}</body>
      </html>
    </>
  );
}
