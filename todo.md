Hand Gesture Controlled Geometric Shapes - MVP Todo
Core Files to Create:
  1. index.html - Main HTML structure with video element and canvas
  2. style.css - Styling for the interface
  3. script.js - Main application logic with MediaPipe hand tracking
  4. gestures.js - Gesture recognition logic
  5. shapes.js - Shape rendering and control logic
Implementation Plan:
  1. Set up HTML with camera feed and canvas overlay
  2. Integrate MediaPipe Hands library via CDN
  3. Implement hand tracking and landmark detection
  4. Create gesture recognition system:
        Open palm = Circle
        Closed fist = Square
        Peace sign = Triangle
        Pinch distance = Control size
        Hand vertical position = Control color (hue)
  5. Render shapes on canvas based on gestures
  6. Add UI controls for camera permissions and instructions
Key Features:
    Real-time hand tracking using front camera
    3 basic geometric shapes (circle, square, triangle)
    Size control via pinch gesture (thumb-index distance)
    Color control via hand vertical position
    Visual feedback and instructions
Dependencies:
    MediaPipe Hands (CDN)
    HTML5 Canvas API 
    WebRTC getUserMedia API