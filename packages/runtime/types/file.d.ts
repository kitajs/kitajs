import type { MultipartFile, SavedMultipartFile } from '@fastify/multipart';

/**
 * ### REQUIRES `@fastify/multipart` with `attachFieldsToBody: true` to work.
 *
 * Retrieves a file from sent as `multipart/form-data`. You can use {@linkcode SavedFile} to save the file to disk and
 * work with it later as a filepath.
 *
 * You can also use `File` alongside with `BodyProp`, but not `Body` as `File` also changes the type of the body.
 *
 * @example
 *
 * ```ts
 * export function post(file: File, named: File<'custom name'>) {
 *   const data = await file.toBuffer();
 * }
 * ```
 */
export type File<_Name extends string = string> = MultipartFile;

/**
 * ### REQUIRES `@fastify/multipart` with `attachFieldsToBody: true` to work.
 *
 * Saves a file sent as `multipart/form-data` to disk. You can use {@linkcode File} to manually process its data stream.
 *
 * You can also use `File` alongside with `BodyProp`, but not `Body` as `File` also changes the type of the body.
 *
 * @example
 *
 * ```ts
 * export function post(file: SavedFile, named: SavedFile<'custom name'>) {
 *   const fileToRead = file.filepath;
 * }
 * ```
 */
export type SavedFile<_Name extends string = string> = SavedMultipartFile;
