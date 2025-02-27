const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const overlayCtx = overlay.getContext('2d');
const startButton = document.getElementById('start');
const loading = document.getElementById('loading');
const result = document.getElementById('result');

// Configuration options
const detectionOptions = {
    // Higher values are more accurate but slower
    scoreThreshold: 0.5,
    inputSize: 320
};

// Load models
async function loadModels() {
    loading.style.display = 'block';
    startButton.disabled = true;
    
    try {
        // Load models from the models directory
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
        await faceapi.nets.ageGenderNet.loadFromUri('/models');
        
        loading.innerText = 'Models loaded successfully!';
        startButton.disabled = false;
    } catch (error) {
        console.error('Error loading models:', error);
        loading.innerText = 'Error loading models. Please check console for details.';
    }
}

// Start video capture
async function startVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
        startButton.disabled = true;
        startButton.innerText = 'Camera Active';
        
        // Start face detection once video is playing
        video.addEventListener('play', () => {
            // Set canvas dimensions to match video
            overlay.width = video.videoWidth;
            overlay.height = video.videoHeight;
            
            // Start detection loop
            detectFaces();
        });
    } catch (err) {
        console.error('Error accessing camera:', err);
        result.innerHTML = `<p>Error accessing camera: ${err.message}</p>`;
    }
}

// Detect faces and emotions
async function detectFaces() {
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(overlay, displaySize);

    // Detect faces with all features
    const detections = await faceapi.detectAllFaces(
        video, 
        new faceapi.TinyFaceDetectorOptions(detectionOptions)
    )
    .withFaceLandmarks()
    .withFaceExpressions()
    .withAgeAndGender();
    
    // Resize detections to match display size
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    
    // Clear previous drawings
    overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
    
    // Draw results on canvas
    faceapi.draw.drawDetections(overlay, resizedDetections);
    faceapi.draw.drawFaceLandmarks(overlay, resizedDetections);
    faceapi.draw.drawFaceExpressions(overlay, resizedDetections);
    
    // Display results in result div
    displayResults(resizedDetections);
    
    // Continue detection loop
    requestAnimationFrame(detectFaces);
}

// Display detection results
function displayResults(detections) {
    if (detections.length === 0) {
        result.innerHTML = '<p>No faces detected</p>';
        return;
    }
    
    let resultsHtml = '';
    
    detections.forEach((detection, index) => {
        const expressions = detection.expressions;
        const gender = detection.gender;
        const genderProbability = Math.round(detection.genderProbability * 100);
        
        // Find the emotion with highest probability
        let topEmotion = Object.keys(expressions)[0];
        let topEmotionValue = expressions[topEmotion];
        
        Object.entries(expressions).forEach(([emotion, value]) => {
            if (value > topEmotionValue) {
                topEmotion = emotion;
                topEmotionValue = value;
            }
        });
        
        // Create HTML for this face
        let faceHtml = `
            <div class="face-info">
                <h3>Face ${index + 1}</h3>
                <p><strong>Top Emotion:</strong> ${topEmotion} (${Math.round(topEmotionValue * 100)}%)</p>
                <h4>All Emotions:</h4>
        `;
        
        // Add bars for all emotions
        Object.entries(expressions).forEach(([emotion, value]) => {
            const percentage = Math.round(value * 100);
            faceHtml += `
                <div>
                    <span>${emotion}: ${percentage}%</span>
                    <div class="emotion-bar">
                        <div class="emotion-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        });
        
        // Add gender information
        faceHtml += `
                <div class="gender ${gender.toLowerCase()}">
                    Gender: ${gender} (${genderProbability}%)
                </div>
            </div>
        `;
        
        resultsHtml += faceHtml;
    });
    
    result.innerHTML = resultsHtml;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadModels();
    startButton.addEventListener('click', startVideo);
});
