// Enhanced gesture recognition utilities with improved precision

export class GestureRecognizer {
    constructor() {
        this.fingerTips = [8, 12, 16, 20]; // Index, Middle, Ring, Pinky
        this.fingerBases = [5, 9, 13, 17];
        this.fingerMids = [6, 10, 14, 18]; // Added middle joints for better detection
        this.thumbTip = 4;
        this.thumbBase = 2;
        this.thumbMid = 3;
        
        // Thresholds for more precise detection
        this.extendedThreshold = 0.05; // Increased sensitivity
        this.thumbExtendedThreshold = 0.08;
    }

    // Enhanced finger extension detection with angle calculation
    isFingerExtended(landmarks, tipIndex, baseIndex, midIndex) {
        const tip = landmarks[tipIndex];
        const base = landmarks[baseIndex];
        const mid = landmarks[midIndex];
        
        // Calculate if finger is straight using both distance and angle
        const tipToBase = Math.sqrt(
            Math.pow(tip.x - base.x, 2) + 
            Math.pow(tip.y - base.y, 2)
        );
        
        const midToBase = Math.sqrt(
            Math.pow(mid.x - base.x, 2) + 
            Math.pow(mid.y - base.y, 2)
        );
        
        // Finger is extended if tip is far from base and mid is between them
        return tip.y < base.y - this.extendedThreshold && tipToBase > midToBase;
    }

    // Enhanced thumb detection
    isThumbExtended(landmarks) {
        const tip = landmarks[this.thumbTip];
        const base = landmarks[this.thumbBase];
        const mid = landmarks[this.thumbMid];
        const wrist = landmarks[0];
        
        // Calculate thumb extension based on horizontal distance and angle
        const horizontalDist = Math.abs(tip.x - base.x);
        const verticalDist = Math.abs(tip.y - wrist.y);
        
        // Thumb is extended if it's far from palm horizontally
        return horizontalDist > this.thumbExtendedThreshold && verticalDist < 0.3;
    }

    // Count extended fingers with improved accuracy
    countExtendedFingers(landmarks) {
        let count = 0;

        // Check thumb with enhanced detection
        if (this.isThumbExtended(landmarks)) {
            count++;
        }

        // Check other fingers with enhanced detection
        for (let i = 0; i < this.fingerTips.length; i++) {
            if (this.isFingerExtended(
                landmarks, 
                this.fingerTips[i], 
                this.fingerBases[i],
                this.fingerMids[i]
            )) {
                count++;
            }
        }

        return count;
    }

    // Enhanced pinch detection with better precision
    getPinchDistance(landmarks) {
        const thumb = landmarks[this.thumbTip];
        const index = landmarks[8];
        const thumbBase = landmarks[this.thumbBase];
        const indexBase = landmarks[5];

        const dx = thumb.x - index.x;
        const dy = thumb.y - index.y;
        const dz = (thumb.z || 0) - (index.z || 0);
        
        // 3D distance for better accuracy
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Calculate base distance for normalization
        const baseDist = Math.sqrt(
            Math.pow(thumbBase.x - indexBase.x, 2) +
            Math.pow(thumbBase.y - indexBase.y, 2)
        );

        // Normalize distance relative to hand size
        const normalizedDistance = distance / (baseDist || 1);

        return {
            isPinching: normalizedDistance < 0.3, // More precise threshold
            distance: distance,
            normalizedDistance: normalizedDistance
        };
    }

    // Get hand vertical position (normalized 0-1)
    getHandHeight(landmarks) {
        const wrist = landmarks[0];
        return 1 - wrist.y; // Invert so top = 1, bottom = 0
    }

    // Enhanced shape detection with stricter criteria
    detectShape(landmarks) {
        const fingerCount = this.countExtendedFingers(landmarks);
        const pinchData = this.getPinchDistance(landmarks);

        // More precise shape detection
        if (fingerCount === 5 && !pinchData.isPinching) {
            return 'circle';
        } else if (fingerCount === 0 || (fingerCount === 1 && this.isThumbExtended(landmarks))) {
            return 'square';
        } else if (fingerCount === 2) {
            // Verify it's actually index and middle fingers
            const indexExtended = this.isFingerExtended(landmarks, 8, 5, 6);
            const middleExtended = this.isFingerExtended(landmarks, 12, 9, 10);
            
            if (indexExtended && middleExtended) {
                return 'triangle';
            }
        } else if (fingerCount === 3) {
            // Alternative triangle gesture (index, middle, ring)
            return 'triangle';
        }

        return null;
    }

    // Get hand center point with improved accuracy
    getHandCenter(landmarks) {
        // Use multiple points for better center calculation
        const wrist = landmarks[0];
        const middleMcp = landmarks[9];
        const indexMcp = landmarks[5];
        const ringMcp = landmarks[13];
        
        const centerX = (wrist.x + middleMcp.x + indexMcp.x + ringMcp.x) / 4;
        const centerY = (wrist.y + middleMcp.y + indexMcp.y + ringMcp.y) / 4;
        
        return {
            x: centerX,
            y: centerY
        };
    }

    // Enhanced size calculation with better range
    calculateSize(pinchDistance) {
        // Map distance (0.02 - 0.4) to size (30 - 350)
        const minDist = 0.02;
        const maxDist = 0.4;
        const minSize = 30;
        const maxSize = 350;

        const clamped = Math.max(minDist, Math.min(maxDist, pinchDistance));
        const normalized = (clamped - minDist) / (maxDist - minDist);
        
        // Apply easing for smoother size changes
        const eased = normalized * normalized; // Quadratic easing
        
        return minSize + eased * (maxSize - minSize);
    }

    // Calculate color based on hand height
    calculateColor(height) {
        // Map height (0-1) to hue (0-360)
        const hue = Math.floor(height * 360);
        return `hsl(${hue}, 70%, 50%)`;
    }

    // Get hand confidence score
    getHandConfidence(landmarks) {
        // Calculate confidence based on landmark visibility
        let visibleCount = 0;
        landmarks.forEach(landmark => {
            if (landmark.visibility !== undefined && landmark.visibility > 0.5) {
                visibleCount++;
            }
        });
        
        return visibleCount / landmarks.length;
    }
}