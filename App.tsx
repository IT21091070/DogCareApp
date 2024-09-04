import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native'; // Import TensorFlow.js React Native
import { decodeJpeg } from '@tensorflow/tfjs-react-native'; // Import the decodeJpeg function
import { Tensor } from '@tensorflow/tfjs-core'; // Import Tensor type

// Define the TensorModel type
type TensorModel = {
  predict: (input: tf.Tensor) => tf.Tensor;
};

export default function App() {
  const [bodyConditionModel, setBodyConditionModel] = useState<TensorModel | null>(null);
  const [dogBreedsModel, setDogBreedsModel] = useState<TensorModel | null>(null);
  const [ageModel, setAgeModel] = useState<TensorModel | null>(null);

  useEffect(() => {
    const initializeTensorFlow = async () => {
      try {
        // Ensure TensorFlow.js is initialized
        await tf.setBackend('webgl'); // Set backend to rn-webgl for performance optimization

        console.log('TensorFlow.js is initialized with rn-webgl backend.');

        // Load models from assets
        const bodyConditionModelUrl = require('./assets/Body_Condition_model/model.json');
        const dogBreedsModelUrl = require('./assets/Dog_Breeds_model/model.json');
        const ageModelUrl = require('./assets/Age_model/model.json');

        try {
          const loadedBodyConditionModel = await tf.loadGraphModel(bodyConditionModelUrl);
          const loadedDogBreedsModel = await tf.loadGraphModel(dogBreedsModelUrl);
          const loadedAgeModel = await tf.loadGraphModel(ageModelUrl);

          setBodyConditionModel(loadedBodyConditionModel as TensorModel);
          setDogBreedsModel(loadedDogBreedsModel as TensorModel);
          setAgeModel(loadedAgeModel as TensorModel);
        } catch (error) {
          console.error('Error loading models:', error);
        }
      } catch (error) {
        console.error('Error initializing TensorFlow.js:', error);
      }
    };

    initializeTensorFlow();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const imageData = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
      const imageBuffer = new Uint8Array(Buffer.from(imageData, 'base64'));
      const imageTensor = decodeJpeg(imageBuffer); // Convert image to tensor

      if (bodyConditionModel && dogBreedsModel && ageModel) {
        // Use your models to make predictions
        try {
          const bodyConditionPrediction = bodyConditionModel.predict(imageTensor);
          const dogBreedPrediction = dogBreedsModel.predict(imageTensor);
          const agePrediction = ageModel.predict(imageTensor);

          // Handle predictions (for example, log them)
          console.log('Predictions:', {
            bodyCondition: await bodyConditionPrediction.array(),
            dogBreed: await dogBreedPrediction.array(),
            age: await agePrediction.array(),
          });
        } catch (error) {
          console.error('Error making predictions:', error);
        }
      }
    }
  };

  if (!bodyConditionModel || !dogBreedsModel || !ageModel) {
    return <Text style={styles.loadingText}>Loading models...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Dog Care App</Text>
      <Button title="Pick an Image" onPress={pickImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
  },
  loadingText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    color: '#555',
  },
});
