declare module 'stream-consumers' {
  type ReadableStreamLike = ReadableStream | AsyncIterable<any>;

  export function arrayBuffer(
    iterable: ReadableStreamLike
  ): Promise<ArrayBuffer>;

  export function blob(iterable: ReadableStreamLike): Promise<Blob>;

  export function text(iterable: ReadableStreamLike): Promise<string>;

  export function json(iterable: ReadableStreamLike): Promise<any>;

  export let Blob: typeof globalThis.Blob;
}
