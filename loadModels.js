import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native'; // Make sure TensorFlow.js is available for React Native
import * as FileSystem from 'expo-file-system';

// Function to load a model from assets
const loadModel = async (modelName) => {
  const modelUri = `${FileSystem.documentDirectory}${modelName}`;
  try {
    // Read the model from the assets
    const model = await tf.loadGraphModel(modelUri);
    console.log(`${modelName} loaded successfully`);
    return model;
  } catch (error) {
    console.error(`Error loading model ${modelName}:`, error);
    return null;
  }
};

export { loadModel };
