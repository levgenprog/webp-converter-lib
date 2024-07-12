const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

// Function to handle the conversion of the image
const handleConvert = async (file: File | null, quality: number): Promise<string> => {
  if (!file) return '';

  if (quality < 0 || quality > 100) return '';

  console.log('Conversion started');

  try {

    const arrayBuffer = await readFileAsArrayBuffer(file);
    console.log('File read as array buffer');

    const bytes = new Uint8Array(arrayBuffer);
    console.log('File converted to Uint8Array');

    const Module = require('./webp_converter.js');
    const converter = new Module.WEBPConverter(bytes, quality);
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

export { readFileAsArrayBuffer, handleConvert };
