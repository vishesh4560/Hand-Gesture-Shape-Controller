import { GestureRecognizer } from './gestures.js';
import { ShapeRenderer } from './shapes.js';

// Main application
class HandGestureApp {
    constructor() {
        this.videoElement = document.getElementById('videoElement');
        this.canvas = document.getElementById('canvas');
        this.startButton = document.getElementById('startButton');
        this.clearButton = document.getElementById('clearButton');
        this.loadingOverlay = document.getElementById('loadingOverlay');

        this.gestureRecognizer = new GestureRecognizer();
        this.shapeRenderer = new ShapeRenderer(this.canvas);

        this.hands = null;
        this.camera = null;
        this.isRunning = false;

        this.currentShape = null;
        this.currentSize = 100;
        this.currentColor = 'hsl(180, 70%, 50%)';

        // Smoothing buffers for stability
        this.shapeHistory = [];
        this.sizeHistory = [];
        this.colorHistory = [];
        this.historySize = 5;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => this.startCamera());
        this.clearButton.addEventListener('click', () => this.clearCanvas());
    }

    async startCamera() {
        try {
            this.startButton.disabled = true;
            this.updateStatus('cameraStatus', 'Initializing...');

            // Initialize MediaPipe Hands with enhanced settings
            this.hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                }
            });

            // Enhanced configuration for better precision - single hand
            this.hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.7,
                minTrackingConfidence: 0.7,
                selfieMode: false
            });

            this.hands.onResults((results) => this.onResults(results));

            // Get camera stream with higher resolution
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'user', 
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    frameRate: { ideal: 30 }
                }
            });

            this.videoElement.srcObject = stream;

            // Wait for video to load
            await new Promise((resolve) => {
                this.videoElement.onloadedmetadata = () => {
                    resolve();
                };
            });

            // Set canvas size
            this.shapeRenderer.setCanvasSize(
                this.videoElement.videoWidth,
                this.videoElement.videoHeight
            );

            // Start camera
            this.camera = new Camera(this.videoElement, {
                onFrame: async () => {
                    if (this.isRunning) {
                        await this.hands.send({ image: this.videoElement });
                    }
                },
                width: 1920,
                height: 1080
            });

            await this.camera.start();

            this.isRunning = true;
            this.loadingOverlay.classList.add('hidden');
            this.updateStatus('cameraStatus', 'Active (Enhanced)');
            this.startButton.textContent = 'Camera Running';

        } catch (error) {
            console.error('Error starting camera:', error);
            alert('Failed to start camera. Please ensure camera permissions are granted.');
            this.startButton.disabled = false;
            this.updateStatus('cameraStatus', 'Error');
        }
    }

    // Smooth values using moving average
    smoothValue(history, newValue, historySize) {
        history.push(newValue);
        if (history.length > historySize) {
            history.shift();
        }
        return history.reduce((sum, val) => sum + val, 0) / history.length;
    }

    // Get most common shape from history (mode)
    getMostCommonShape(history, newShape, historySize) {
        history.push(newShape);
        if (history.length > historySize) {
            history.shift();
        }

        // Count occurrences
        const counts = {};
        history.forEach(shape => {
            counts[shape] = (counts[shape] || 0) + 1;
        });

        // Return most common
        let maxCount = 0;
        let mostCommon = newShape;
        for (const [shape, count] of Object.entries(counts)) {
            if (count > maxCount) {
                maxCount = count;
                mostCommon = shape;
            }
        }

        return mostCommon;
    }

    onResults(results) {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        // Clear canvas
        this.shapeRenderer.clear();

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];

            // Update hand status
            this.updateStatus('handStatus', 'Yes (Strong Signal)');

            // Draw hand landmarks
            this.shapeRenderer.drawHandLandmarks(landmarks, canvasWidth, canvasHeight);

            // Detect shape with improved recognition
            const detectedShape = this.gestureRecognizer.detectShape(landmarks);
            
            if (detectedShape) {
                // Apply smoothing to shape detection
                this.currentShape = this.getMostCommonShape(this.shapeHistory, detectedShape, this.historySize);
                this.updateStatus('shapeStatus', this.currentShape.charAt(0).toUpperCase() + this.currentShape.slice(1));

                // Get pinch distance for size control with smoothing
                const pinchData = this.gestureRecognizer.getPinchDistance(landmarks);
                const rawSize = this.gestureRecognizer.calculateSize(pinchData.distance);
                this.currentSize = this.smoothValue(this.sizeHistory, rawSize, this.historySize);
                this.updateStatus('sizeStatus', Math.round(this.currentSize));

                // Get hand height for color control with smoothing
                const height = this.gestureRecognizer.getHandHeight(landmarks);
                const rawHue = height * 360;
                const smoothedHue = this.smoothValue(this.colorHistory, rawHue, this.historySize);
                this.currentColor = `hsl(${Math.floor(smoothedHue)}, 70%, 50%)`;

                // Get hand center
                const center = this.gestureRecognizer.getHandCenter(landmarks);
                const x = center.x * canvasWidth;
                const y = center.y * canvasHeight;

                // Draw current shape
                this.shapeRenderer.drawShape(this.currentShape, x, y, this.currentSize, this.currentColor);

                // Add to trail
                this.shapeRenderer.addTrail(this.currentShape, x, y, this.currentSize, this.currentColor);
            } else {
                this.updateStatus('shapeStatus', 'Gesture not recognized');
            }

            // Draw trail
            this.shapeRenderer.drawTrail();

        } else {
            this.updateStatus('handStatus', 'No');
            this.updateStatus('shapeStatus', 'None');
            
            // Clear history when hand is not detected
            this.shapeHistory = [];
            this.sizeHistory = [];
            this.colorHistory = [];
        }
    }

    clearCanvas() {
        this.shapeRenderer.clear();
    }

    updateStatus(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new HandGestureApp();
});