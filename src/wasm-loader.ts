import Module from 'webp_converter';

export async function loadWasm() {
    const response = await fetch('./node_modules/webp-converter-lib/dist/webp_converter.wasm');
    const buffer = await response.arrayBuffer();
    const module = await Module({ wasmBinary: buffer });
    return module;
}