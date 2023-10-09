import Html from '@kitajs/html';

export function Layout(props: Html.PropsWithChildren) {
  return (
    <>
      {'<!DOCTYPE html>'}
      <html lang="en">
        <head>
          <meta char-set="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>KitaJs</title>
        </head>
        <body>{props.children}</body>
      </html>
    </>
  );
}
