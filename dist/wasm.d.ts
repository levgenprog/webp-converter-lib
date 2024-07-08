declare class WEBPConverter {
    constructor(input: Uint8Array, quality: number);
    convertImage(): Uint8Array;
  }
  
  declare let Module: {
    WEBPConverter: typeof WEBPConverter;
  }
  
  