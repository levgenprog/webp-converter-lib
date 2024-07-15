declare module "webp_converter" {
  export class WEBPConverter {
    constructor(inputBytes: Uint8Array, outputQuality: number);
    convertImage(): Uint8Array;
  }

  const wasmModule: (options?: { wasmBinary?: ArrayBuffer }) => Promise<WEBPConverter>;
  export default wasmModule;
}
