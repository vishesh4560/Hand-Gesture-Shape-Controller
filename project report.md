Project Summary:-

The project is an interactive web application that allows users to create and manipulate geometric shapes using real-time hand gesture recognition. 
By utilizing advanced hand detection technology, users can control the size and color of shapes like circles, squares, and triangles. 
The application employs MediaPipe for precise hand tracking and HTML5 Canvas for rendering, providing a dynamic and engaging user experience. 
Recent updates have introduced two-hand control for more intuitive shape manipulation.

Project Module Description:-
The application consists of the following functional modules:

 ~ Gesture Recognition: Detects hand gestures and translates them into shape commands with enhanced precision.
 ~ Shape Rendering: Draws geometric shapes on the canvas based on user gestures.
 ~ Camera Integration: Manages camera feed and video processing for real-time interaction.
 ~ User Interface: Provides controls and status updates for user interaction.
Directory Tree:-

html_template/

├── gestures.js              # Enhanced gesture recognition logic with improved precision
├── index.html               # Main HTML structure with video element and canvas
├── package.json             # Project dependencies and scripts
├── script.js                # Main application logic with improved hand detection and two-hand control
├── shapes.js                # Shape rendering and control logic
├── style.css                # Styling for the interface
└── template_config.json      # Configuration for templates
└── todo.md                  # MVP Todo file
File Description Inventory:-

 ~ gestures.js: Contains enhanced logic for recognizing hand gestures with improved detection precision.
 ~ index.html: The main HTML file that structures the user interface, including the video and canvas elements.
 ~ package.json: Lists project dependencies and scripts for building and running the application.
 ~ script.js: Implements the main functionality of the application, handling gesture recognition and shape rendering with optimized algorithms and two-hand control.
 ~ shapes.js: Provides utilities for rendering geometric shapes on the canvas.
 ~ style.css: Defines the visual styling of the application interface.
 ~ template_config.json: Configuration settings for templates used in the project.
 ~ todo.md: Outlines the core files to create and implementation plan for the project.

Technology Stack:-

 ~ HTML5: For structuring the web application.
 ~ CSS3: For styling the web application.
 ~ JavaScript: For implementing the application logic.
 ~ MediaPipe: For hand tracking and gesture recognition.
 ~ HTML5 Canvas API: For rendering shapes on the canvas.

Usage:-

 ~ Install dependencies using the package manager.
 ~ Build the project to ensure all files are compiled correctly.
 ~ Run the application in your local environment.
 ~ Click the “Start Camera” button to begin using the gesture controls.
 ~ Allow camera permissions when prompted.
 ~ Use specified hand gestures to create and manipulate shapes on the canvas.