import { loadWasm } from './wasm-loader';

export class ImageConverter {
  private module: any;

  constructor() {
    this.module = null;
  }

  async initialize() {
    this.module = await loadWasm();
  }

  readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  };

  handleConvert = async (file: File | null, quality: number): Promise<string> => {
    if (!file) return '';

    if (quality < 0 || quality > 100) return '';

    console.log('Conversion started');

    try {
      if (!this.module) {
        await this.initialize();
      }

      const arrayBuffer = await this.readFileAsArrayBuffer(file);
      console.log('File read as array buffer');

      const bytes = new Uint8Array(arrayBuffer);
      console.log('File converted to Uint8Array');

      const converter = new this.module.WEBPConverter(bytes, quality);
      const output = converter.convertImage();
      console.log('Image converted');

      const blob = new Blob([output], { type: 'image/webp' });
      const url = URL.createObjectURL(blob);
      console.log('Image conversion successful, URL created');
      console.log('Conversion ended');

      return url;
    } catch (error) {
      console.error('Error converting image:', error);
      return '';
    }
  };
}
