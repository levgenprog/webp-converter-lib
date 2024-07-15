declare module 'webp-converter-lib' {
    export class ImageConverter {
      initialize(): Promise<void>;
      readFileAsArrayBuffer(file: File): Promise<ArrayBuffer>;
      handleConvert(file: File | null, quality: number): Promise<string>;
    }
}
  