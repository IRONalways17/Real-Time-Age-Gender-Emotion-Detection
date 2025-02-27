# Face Emotion and Gender Detection App

This web application uses face-api.js to detect and analyze faces in real-time. It can identify facial expressions (emotions) and gender with high accuracy using pre-trained models.

## Features

- Real-time face detection
- Emotion recognition (happy, sad, angry, disgusted, surprised, fearful, neutral)
- Gender classification with probability score
- Works directly in the browser with no backend required
- Visual displays of detection results

## Setup and Deployment

### Prerequisites

- Web server (can be local for development)
- Modern web browser (Chrome, Firefox, Edge recommended)

### Installation

1. Clone this repository:
```
git clone https://github.com/IRONalways17/face-emotion-gender-detection.git
cd face-emotion-gender-detection
```

2. Download the face-api.js models:
   - Create a `models` folder in the root directory
   - Download the models from [face-api.js models](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)
   - You need the following model files in the models folder:
     - `tiny_face_detector_model-weights_manifest.json`
     - `tiny_face_detector_model-shard1`
     - `face_landmark_68_model-weights_manifest.json`
     - `face_landmark_68_model-shard1`
     - `face_recognition_model-weights_manifest.json`
     - `face_recognition_model-shard1`
     - `face_recognition_model-shard2`
     - `face_expression_model-weights_manifest.json`
     - `face_expression_model-shard1`
     - `age_gender_model-weights_manifest.json`
     - `age_gender_model-shard1`

   Alternatively, you can use this command to download all required models:
   ```
   git clone https://github.com/justadudewhohacks/face-api.js.git
   cp -r face-api.js/weights ./models
   rm -rf face-api.js
   ```

3. Start a local web server:
   - Using Python (if installed):
     ```
     # Python 3
     python -m http.server
     # Python 2
     python -m SimpleHTTPServer
     ```
   - Using Node.js (if installed):
     ```
     # Install http-server if needed
     npm install -g http-server
     # Start server
     http-server
     ```

4. Open your browser and navigate to:
   - `http://localhost:8000` (or the port your server is running on)

### Deployment on GitHub Pages

1. Create a GitHub repository.
2. Push your code to the repository:
```
git remote add origin https://github.com/yourusername/face-emotion-gender-detection.git
git branch -M main
git push -u origin main
```

3. Enable GitHub Pages:
   - Go to your repository settings
   - Scroll down to the GitHub Pages section
   - Select the main branch as the source
   - Click Save

4. Your app will be available at `https://yourusername.github.io/face-emotion-gender-detection/`

## How It Works

This application uses face-api.js, which is built on top of TensorFlow.js, to run facial analysis entirely in the browser:

1. The app loads pre-trained models for face detection, landmark recognition, emotion analysis, and gender classification.
2. When the user starts the camera, the video feed is analyzed frame by frame.
3. For each detected face:
   - Facial landmarks are identified
   - Emotions are analyzed and probabilities are calculated
   - Gender is predicted with a confidence score
4. Results are displayed on screen in real-time, with visual overlays on the detected faces.

## Customization

You can modify the detection settings in the script.js file:
- `scoreThreshold`: Controls the minimum confidence score for face detection (higher value = fewer detections but more accurate)
- `inputSize`: Controls the size of the input image for the neural network (higher value = more accurate but slower)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [face-api.js](https://github.com/justadudewhohacks/face-api.js/) - JavaScript API for face detection and recognition
- [TensorFlow.js](https://www.tensorflow.org/js) - Machine learning framework for JavaScript
