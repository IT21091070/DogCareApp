declare module '@tensorflow/tfjs' {
    export type Tensor = any;  // Define `Tensor` type or import from actual module if needed
    export function loadGraphModel(path: string): Promise<any>;  // Adjust based on actual module functions
  }
  
  declare module '@tensorflow/tfjs-react-native' {
    import * as tf from '@tensorflow/tfjs';
    export function decodeJpeg(buffer: Uint8Array): tf.Tensor;
  }
  
