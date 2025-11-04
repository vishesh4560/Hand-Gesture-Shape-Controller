// Shape rendering utilities

export class ShapeRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.currentShapes = [];
    }

    setCanvasSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentShapes = [];
    }

    drawCircle(x, y, size, color) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }

    drawSquare(x, y, size, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x - size / 2, y - size / 2, size, size);
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x - size / 2, y - size / 2, size, size);
    }

    drawTriangle(x, y, size, color) {
        const height = (size * Math.sqrt(3)) / 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - height / 2);
        this.ctx.lineTo(x - size / 2, y + height / 2);
        this.ctx.lineTo(x + size / 2, y + height / 2);
        this.ctx.closePath();
        
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }

    drawShape(shape, x, y, size, color) {
        switch (shape) {
            case 'circle':
                this.drawCircle(x, y, size, color);
                break;
            case 'square':
                this.drawSquare(x, y, size, color);
                break;
            case 'triangle':
                this.drawTriangle(x, y, size, color);
                break;
        }
    }

    drawHandLandmarks(landmarks, width, height) {
        // Draw connections
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8], // Index
            [0, 9], [9, 10], [10, 11], [11, 12], // Middle
            [0, 13], [13, 14], [14, 15], [15, 16], // Ring
            [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
            [5, 9], [9, 13], [13, 17] // Palm
        ];

        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        this.ctx.lineWidth = 2;

        connections.forEach(([start, end]) => {
            this.ctx.beginPath();
            this.ctx.moveTo(landmarks[start].x * width, landmarks[start].y * height);
            this.ctx.lineTo(landmarks[end].x * width, landmarks[end].y * height);
            this.ctx.stroke();
        });

        // Draw landmarks
        landmarks.forEach((landmark, index) => {
            const x = landmark.x * width;
            const y = landmark.y * height;

            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = index === 4 || index === 8 ? 'red' : 'lime';
            this.ctx.fill();
        });
    }

    addTrail(shape, x, y, size, color) {
        this.currentShapes.push({ shape, x, y, size, color, alpha: 1.0 });

        // Limit trail length
        if (this.currentShapes.length > 10) {
            this.currentShapes.shift();
        }
    }

    drawTrail() {
        this.currentShapes.forEach((shapeData, index) => {
            const alpha = (index + 1) / this.currentShapes.length * 0.5;
            this.ctx.globalAlpha = alpha;
            this.drawShape(shapeData.shape, shapeData.x, shapeData.y, shapeData.size, shapeData.color);
        });
        this.ctx.globalAlpha = 1.0;
    }
}