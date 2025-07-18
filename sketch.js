// Global variables
let shapes = {
    boxes: []
};
let settings = {
    trail: false,
    maxShapes: 1000, // Prevent performance issues
    padding: 20, // Padding from screen edges
    minDistance: 80, // Minimum distance between shapes when spawning
    squareMode: false, // Toggle for making all shapes square
    showBorder: true, // Toggle for showing 1px black border (default: on)
    showHelp: false, // Toggle for showing help menu

    // Parameters that can be adjusted with sliders
    minSize: 30,
    maxSize: 70,
    speed: 5,
    rotationSpeed: 0.05
};

// Store the initial rotation speed to ensure it's preserved
const initialRotationSpeed = 0.05;

// Slider objects
let sliders = {};

// Setup function - runs once at the beginning
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);

    // Create initial shapes
    createShapes('boxes', 1);

    // Remove scrollbars
    document.documentElement.style.overflow = 'hidden';

    // Create sliders
    createSliders();

    // Display instructions
    showInstructions();
}

// Create sliders for the help menu
function createSliders() {
    // Min/Max Size slider
    sliders.minSize = createInput(settings.minSize.toString(), 'range');
    sliders.minSize.attribute('min', '10');
    sliders.minSize.attribute('max', '50');
    sliders.minSize.attribute('step', '1');
    sliders.minSize.position(0, 0); // Position will be set in displayHelpMenu
    sliders.minSize.style('width', '150px');
    sliders.minSize.hide();

    sliders.maxSize = createInput(settings.maxSize.toString(), 'range');
    sliders.maxSize.attribute('min', '30');
    sliders.maxSize.attribute('max', '150');
    sliders.maxSize.attribute('step', '1');
    sliders.maxSize.position(0, 0);
    sliders.maxSize.style('width', '150px');
    sliders.maxSize.hide();

    // Speed slider
    sliders.speed = createInput(settings.speed.toString(), 'range');
    sliders.speed.attribute('min', '1');
    sliders.speed.attribute('max', '15');
    sliders.speed.attribute('step', '0.5');
    sliders.speed.position(0, 0);
    sliders.speed.style('width', '150px');
    sliders.speed.hide();

    // Rotation speed slider - increased max value for more visible rotation
    sliders.rotationSpeed = createInput(initialRotationSpeed.toString(), 'range');
    sliders.rotationSpeed.attribute('min', '0');
    sliders.rotationSpeed.attribute('max', '0.5'); // Increased from 0.2 to 0.5
    sliders.rotationSpeed.attribute('step', '0.01');
    sliders.rotationSpeed.position(0, 0);
    sliders.rotationSpeed.style('width', '150px');
    sliders.rotationSpeed.hide();

    // Shape count slider
    sliders.shapeCount = createInput('50', 'range');
    sliders.shapeCount.attribute('min', '0');
    sliders.shapeCount.attribute('max', '500');
    sliders.shapeCount.attribute('step', '5');
    sliders.shapeCount.position(0, 0);
    sliders.shapeCount.style('width', '150px');
    sliders.shapeCount.hide();
}

// Draw function - loops continuously
function draw() {
    // Clear background if trail effect is off
    if (!settings.trail) background(0);

    // Update and display all shapes
    updateShapes('boxes');

    // Display help menu if enabled
    if (settings.showHelp) {
        displayHelpMenu();
    }
}

// Handle window resizing
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}

// Box class
class Box {
    constructor(x, y) {
        // If square mode is on, use the same value for width and height
        if (settings.squareMode) {
            const size = random(settings.minSize, settings.maxSize);
            this.width = size;
            this.height = size;
        } else {
            this.width = random(settings.minSize, settings.maxSize);
            this.height = random(settings.minSize, settings.maxSize);
        }
        // Ensure position is within screen bounds
        this.pos = createVector(
            constrain(x, settings.padding, width - this.width - settings.padding),
            constrain(y, settings.padding, height - this.height - settings.padding)
        );
        this.velocity = createVector(random(-settings.speed, settings.speed), random(-settings.speed, settings.speed));
        // Ensure velocity is never zero
        if (abs(this.velocity.x) < 0.5) this.velocity.x = this.velocity.x < 0 ? -0.5 : 0.5;
        if (abs(this.velocity.y) < 0.5) this.velocity.y = this.velocity.y < 0 ? -0.5 : 0.5;
        this.color = this.randomColor();
        this.rotation = 0;

        // Get the current rotation speed from settings, ensuring it's never zero
        const currentRotationSpeed = max(settings.rotationSpeed, 0.01);
        this.rotationSpeed = random(-currentRotationSpeed, currentRotationSpeed);
    }

    randomColor() {
        return color(random(255), random(255), random(255), 220);
    }

    display() {
        push();
        translate(this.pos.x + this.width / 2, this.pos.y + this.height / 2);
        rotate(this.rotation);
        fill(this.color);

        if (settings.showBorder) {
            stroke(0); // Black border
            strokeWeight(1); // 1px border
        } else {
            noStroke();
        }

        rect(-this.width / 2, -this.height / 2, this.width, this.height, 5);
        pop();
    }

    update() {
        this.pos.add(this.velocity);
        this.rotation += this.rotationSpeed;
        this.checkCollisions();
    }

    bounce() {
        // Detect if stuck in wall
        let stuckInWall = false;

        // Check if stuck in right wall
        if (this.pos.x > width - this.width) {
            this.velocity.x = -abs(this.velocity.x); // Force move left
            this.pos.x = width - this.width - 1; // Push away from wall
            stuckInWall = true;
        }

        // Check if stuck in left wall
        if (this.pos.x < 0) {
            this.velocity.x = abs(this.velocity.x); // Force move right
            this.pos.x = 1; // Push away from wall
            stuckInWall = true;
        }

        // Check if stuck in bottom wall
        if (this.pos.y > height - this.height) {
            this.velocity.y = -abs(this.velocity.y); // Force move up
            this.pos.y = height - this.height - 1; // Push away from wall
            stuckInWall = true;
        }

        // Check if stuck in top wall
        if (this.pos.y < 0) {
            this.velocity.y = abs(this.velocity.y); // Force move down
            this.pos.y = 1; // Push away from wall
            stuckInWall = true;
        }

        // Change color if stuck
        if (stuckInWall) {
            this.color = this.randomColor();
        }
    }

    checkCollisions() {
        // Check for collisions with other boxes
        for (let other of shapes.boxes) {
            if (this === other) continue;

            if (this.collidesWith(other)) {
                // Simple collision response
                let temp = this.velocity.copy();
                this.velocity = other.velocity.copy();
                other.velocity = temp;

                // Change colors
                this.color = this.randomColor();
                other.color = other.randomColor();

                // Prevent boxes from getting stuck inside each other
                this.unstuckFromShape(other);
            }
        }
    }

    unstuckFromShape(other) {
        // Calculate overlap on each axis
        let overlapX = 0;
        let overlapY = 0;

        // Calculate horizontal overlap
        if (this.pos.x < other.pos.x) {
            // This box is on the left
            overlapX = (this.pos.x + this.width) - other.pos.x;
        } else {
            // This box is on the right
            overlapX = this.pos.x - (other.pos.x + other.width);
        }

        // Calculate vertical overlap
        if (this.pos.y < other.pos.y) {
            // This box is above
            overlapY = (this.pos.y + this.height) - other.pos.y;
        } else {
            // This box is below
            overlapY = this.pos.y - (other.pos.y + other.height);
        }

        // Determine which axis has the smaller overlap
        if (abs(overlapX) < abs(overlapY)) {
            // Separate horizontally
            if (this.pos.x < other.pos.x) {
                this.pos.x = other.pos.x - this.width - 1;
            } else {
                this.pos.x = other.pos.x + other.width + 1;
            }
        } else {
            // Separate vertically
            if (this.pos.y < other.pos.y) {
                this.pos.y = other.pos.y - this.height - 1;
            } else {
                this.pos.y = other.pos.y + other.height + 1;
            }
        }
    }

    collidesWith(other) {
        return (
            this.pos.x < other.pos.x + other.width &&
            this.pos.x + this.width > other.pos.x &&
            this.pos.y < other.pos.y + other.height &&
            this.pos.y + this.height > other.pos.y
        );
    }
}

// Helper functions
function createShapes(type, num) {
    for (let i = 0; i < num; i++) {
        // Check if we've reached the maximum number of shapes
        if (shapes[type].length >= settings.maxShapes) return;

        // Try to find a position that doesn't overlap with existing shapes
        let attempts = 0;
        let validPosition = false;
        let x, y;

        while (!validPosition && attempts < 10) {
            validPosition = true;
            x = random(settings.padding, width - settings.padding);
            y = random(settings.padding, height - settings.padding);

            // Check against existing shapes
            if (type === 'boxes') {
                for (let box of shapes.boxes) {
                    let testBox = new Box(x, y);
                    if (testBox.collidesWith(box)) {
                        validPosition = false;
                        break;
                    }
                }
            }

            attempts++;
            if (attempts >= 10) {
                // If we can't find a valid position after 10 attempts, just use the last one
                console.log("Couldn't find non-overlapping position after 10 attempts");
            }
        }

        if (type === 'boxes') {
            shapes.boxes.push(new Box(x, y));
        }
    }
}

function updateShapes(type) {
    for (let shape of shapes[type]) {
        shape.display();
        shape.update();
        shape.bounce();
    }
}

function removeShapes(type, num) {
    for (let i = 0; i < num; i++) {
        if (shapes[type].length > 0) {
            shapes[type].pop();
        }
    }
}

function showInstructions() {
    let instructions = [
        "Controls:",
        "- Scroll wheel: Add/remove shapes",
        "- Spacebar: Toggle trails",
        "- 'H': Toggle help menu",
        "- 'S': Save screenshot",
        "- 'D': Delete all shapes",
        "- 'Q': Toggle square mode",
        "- 'B': Toggle border"
    ];

    fill(255);
    textSize(16);
    textAlign(LEFT, TOP);
    for (let i = 0; i < instructions.length; i++) {
        text(instructions[i], 10, 10 + i * 20);
    }

    // Instructions fade out after 5 seconds
    setTimeout(() => {
        // We don't need to do anything here as the next draw() call will clear it
    }, 5000);
}

// Display help menu
function displayHelpMenu() {
    // Semi-transparent background for better readability
    push();
    fill(0, 0, 0, 200);
    noStroke();
    rectMode(CENTER);
    rect(width / 2, height / 2, 550, 600, 10);

    // Title
    fill(255);
    textSize(24);
    textAlign(CENTER, TOP);
    text("CONTROLS", width / 2, height / 2 - 280);

    // Help content
    textSize(16);
    textAlign(LEFT, TOP);
    let helpContent = [
        "Mouse Wheel Up: Add 5 shapes",
        "Mouse Wheel Down: Remove 5 shapes",
        "Mouse Drag: Create shapes at cursor",
        "Spacebar: Toggle trail effect",
        "H: Toggle this help menu",
        "Q: Toggle square mode",
        "B: Toggle 1px black border",
        "S: Save screenshot as PNG",
        "D: Delete all shapes"
    ];

    let yPos = height / 2 - 240;
    for (let i = 0; i < helpContent.length; i++) {
        text(helpContent[i], width / 2 - 250, yPos + i * 30);
    }

    // Sliders section
    textSize(20);
    textAlign(CENTER, TOP);
    text("SETTINGS", width / 2, height / 2 + 20);

    // Position and show sliders
    const sliderX = width / 2 - 75;
    const sliderStartY = height / 2 + 60;
    const sliderSpacing = 40;

    // Min Size slider
    sliders.minSize.position(sliderX, sliderStartY);
    sliders.minSize.show();
    let newMinSize = parseInt(sliders.minSize.value());
    if (newMinSize !== settings.minSize) {
        settings.minSize = newMinSize;
        updateExistingShapeSizes();
    }

    // Max Size slider
    sliders.maxSize.position(sliderX, sliderStartY + sliderSpacing);
    sliders.maxSize.show();
    let newMaxSize = parseInt(sliders.maxSize.value());
    if (newMaxSize !== settings.maxSize) {
        settings.maxSize = newMaxSize;
        updateExistingShapeSizes();
    }

    // Speed slider
    sliders.speed.position(sliderX, sliderStartY + sliderSpacing * 2);
    sliders.speed.show();
    let newSpeed = parseFloat(sliders.speed.value());
    if (newSpeed !== settings.speed) {
        settings.speed = newSpeed;
        updateExistingShapeSpeeds();
    }

    // Rotation speed slider
    sliders.rotationSpeed.position(sliderX, sliderStartY + sliderSpacing * 3);
    sliders.rotationSpeed.show();

    // Get the current value from the slider
    let newRotationSpeed = parseFloat(sliders.rotationSpeed.value());

    // Update the rotation speed setting if the slider value has changed
    if (newRotationSpeed !== settings.rotationSpeed) {
        settings.rotationSpeed = newRotationSpeed;
        updateExistingShapeRotations();
    }

    // Shape count slider
    sliders.shapeCount.position(sliderX, sliderStartY + sliderSpacing * 4);
    sliders.shapeCount.show();

    // Add labels for sliders
    textAlign(LEFT, CENTER);
    textSize(14);
    fill(255);
    text("Min Size: " + settings.minSize, sliderX - 150, sliderStartY + 10);
    text("Max Size: " + settings.maxSize, sliderX - 150, sliderStartY + sliderSpacing + 10);
    text("Speed: " + settings.speed, sliderX - 150, sliderStartY + sliderSpacing * 2 + 10);
    text("Rotation: " + settings.rotationSpeed.toFixed(2), sliderX - 150, sliderStartY + sliderSpacing * 3 + 10);
    text("Shape Count: " + sliders.shapeCount.value(), sliderX - 150, sliderStartY + sliderSpacing * 4 + 10);

    // Add buttons for shape count
    textAlign(CENTER, CENTER);
    fill(100, 200, 255);
    rect(sliderX + 180, sliderStartY + sliderSpacing * 4, 60, 25, 5);
    fill(0);
    text("Apply", sliderX + 180, sliderStartY + sliderSpacing * 4 + 12);

    // Footer
    textSize(14);
    textAlign(CENTER, TOP);
    fill(255);
    text("Press H to close this menu", width / 2, height / 2 + 280);
    pop();

    // Check if Apply button is clicked
    if (mouseIsPressed &&
        mouseX > sliderX + 150 && mouseX < sliderX + 210 &&
        mouseY > sliderStartY + sliderSpacing * 4 - 12 && mouseY < sliderStartY + sliderSpacing * 4 + 13) {

        // Adjust shape count
        const targetCount = parseInt(sliders.shapeCount.value());
        const currentCount = shapes.boxes.length;

        if (targetCount > currentCount) {
            // Add shapes
            createShapes('boxes', targetCount - currentCount);
        } else if (targetCount < currentCount) {
            // Remove shapes
            removeShapes('boxes', currentCount - targetCount);
        }
    }
}

// Event handlers
function keyPressed() {
    // Toggle trail effect with spacebar
    if (keyCode === 32) {
        settings.trail = !settings.trail;
    }

    // Toggle square mode with 'Q'
    if (key === 'q' || key === 'Q') {
        settings.squareMode = !settings.squareMode;
        console.log("Square mode: " + (settings.squareMode ? "ON" : "OFF"));

        // Make existing boxes square if square mode is on
        if (settings.squareMode) {
            for (let box of shapes.boxes) {
                // Set height equal to width for a perfect square
                let size = (box.width + box.height) / 2; // Average of current dimensions
                box.width = size;
                box.height = size;
            }
        }
    }

    // Toggle border with 'B'
    if (key === 'b' || key === 'B') {
        settings.showBorder = !settings.showBorder;
        console.log("Border: " + (settings.showBorder ? "ON" : "OFF"));
    }
}

function keyTyped() {
    // Save canvas as PNG with 'S'
    if (key === 's' || key === 'S') {
        saveCanvas('bouncing-shapes', 'png');
    }

    // Delete all shapes with 'D'
    if (key === 'd' || key === 'D') {
        shapes.boxes = [];
    }

    // Toggle help menu with 'H'
    if (key === 'h' || key === 'H') {
        // Before toggling the help menu, ensure the rotation slider is set correctly
        if (!settings.showHelp) {
            // We're about to open the menu, prepare the slider
            sliders.rotationSpeed.value(settings.rotationSpeed.toString());
        }

        settings.showHelp = !settings.showHelp;

        if (!settings.showHelp) {
            // Hide all sliders when help menu is closed
            hideAllSliders();
        }
    }
}

function mouseWheel(event) {
    if (event.delta < 0) {
        // Add shapes when scrolling up
        createShapes('boxes', 5);
    } else {
        // Remove shapes when scrolling down
        removeShapes('boxes', 5);
    }

    // Prevent default scrolling behavior
    return false;
}

// Add mouse interaction
function mouseDragged() {
    // Don't create shapes if mouse is over UI elements
    if (isMouseOverUI()) {
        return;
    }

    // Create a shape at the mouse position when dragging
    shapes.boxes.push(new Box(mouseX, mouseY));
    if (shapes.boxes.length > settings.maxShapes) {
        shapes.boxes.shift(); // Remove oldest box if we exceed the limit
    }
}

// Hide all sliders
function hideAllSliders() {
    for (let key in sliders) {
        if (sliders.hasOwnProperty(key)) {
            sliders[key].hide();
        }
    }
}

// Check if mouse is over any UI element
function isMouseOverUI() {
    if (!settings.showHelp) return false;

    // Define help menu boundaries
    const menuWidth = 550;
    const menuHeight = 600;
    const menuLeft = width / 2 - menuWidth / 2;
    const menuRight = width / 2 + menuWidth / 2;
    const menuTop = height / 2 - menuHeight / 2;
    const menuBottom = height / 2 + menuHeight / 2;

    // Check if mouse is within menu boundaries
    return (mouseX > menuLeft && mouseX < menuRight &&
        mouseY > menuTop && mouseY < menuBottom);
}

// Update existing shapes when size sliders change
function updateExistingShapeSizes() {
    // Update boxes
    for (let box of shapes.boxes) {
        if (settings.squareMode) {
            // Keep squares square, but adjust their size
            let size = constrain((box.width + box.height) / 2, settings.minSize, settings.maxSize);
            box.width = size;
            box.height = size;
        } else {
            // Maintain aspect ratio but scale to new size range
            let newWidth = constrain(box.width, settings.minSize, settings.maxSize);
            let newHeight = constrain(box.height, settings.minSize, settings.maxSize);
            box.width = newWidth;
            box.height = newHeight;
        }
    }
}

// Update existing shapes when speed slider changes
function updateExistingShapeSpeeds() {
    // Scale all velocities to maintain direction but adjust speed
    for (let box of shapes.boxes) {
        let currentSpeed = box.velocity.mag();
        if (currentSpeed > 0) {
            let direction = box.velocity.copy().normalize();
            // Apply the new speed directly
            box.velocity = direction.mult(settings.speed);
        } else {
            // If velocity is zero, give it a random direction with the new speed
            let angle = random(TWO_PI);
            box.velocity = createVector(cos(angle) * settings.speed, sin(angle) * settings.speed);
        }
    }
}

// Update existing shapes when rotation slider changes
function updateExistingShapeRotations() {
    // Directly set rotation speeds based on the slider value
    // This makes the effect more immediate and noticeable

    for (let box of shapes.boxes) {
        // Keep the sign (direction) but update the magnitude
        let direction = box.rotationSpeed >= 0 ? 1 : -1;
        // Add some variation so not all shapes rotate at exactly the same speed
        let variation = random(0.7, 1.3);
        box.rotationSpeed = direction * settings.rotationSpeed * variation;
    }
}