// Global variables
let shapes = {
    boxes: [],
    stars: []
};
let settings = {
    trail: false,
    showStars: false,
    maxShapes: 100 // Prevent performance issues
};

// Setup function - runs once at the beginning
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);

    // Create initial shapes
    createShapes('boxes', 1);

    // Remove scrollbars
    document.documentElement.style.overflow = 'hidden';

    // Display instructions
    showInstructions();
}

// Draw function - loops continuously
function draw() {
    // Clear background if trail effect is off
    if (!settings.trail) background(0);

    // Update and display all shapes
    updateShapes('boxes');
    if (settings.showStars) updateShapes('stars');
}

// Handle window resizing
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}

// Box class
class Box {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.width = random(30, 70);
        this.height = random(30, 70);
        this.velocity = createVector(random(-5, 5), random(-5, 5));
        this.color = this.randomColor();
        this.rotation = 0;
        this.rotationSpeed = random(-0.05, 0.05);
    }

    randomColor() {
        return color(random(255), random(255), random(255), 220);
    }

    display() {
        push();
        translate(this.pos.x + this.width / 2, this.pos.y + this.height / 2);
        rotate(this.rotation);
        fill(this.color);
        noStroke();
        rect(-this.width / 2, -this.height / 2, this.width, this.height, 5);
        pop();
    }

    update() {
        this.pos.add(this.velocity);
        this.rotation += this.rotationSpeed;
        this.checkCollisions();
    }

    bounce() {
        // Bounce off walls
        if (this.pos.x > width - this.width || this.pos.x < 0) {
            this.velocity.x *= -1;
            this.color = this.randomColor();
        }
        if (this.pos.y > height - this.height || this.pos.y < 0) {
            this.velocity.y *= -1;
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

// Star class
class Star {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.velocity = createVector(random(-3, 3), random(-3, 3));
        this.color = color(random(200, 255), random(200, 255), random(100, 255), 200);
        this.radius1 = random(10, 30);
        this.radius2 = random(30, 60);
        this.width = this.radius2 * 2;
        this.height = this.radius2 * 2;
        this.points = floor(random(5, 12));
        this.rotation = 0;
        this.rotationSpeed = random(-0.02, 0.02);
    }

    display() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.rotation);
        fill(this.color);
        noStroke();
        this.drawStar(0, 0, this.radius1, this.radius2, this.points);
        pop();
    }

    update() {
        this.pos.add(this.velocity);
        this.rotation += this.rotationSpeed;
    }

    bounce() {
        if (this.pos.x > width - this.width / 2 || this.pos.x < this.width / 2) {
            this.velocity.x *= -1;
            this.color = color(random(200, 255), random(200, 255), random(100, 255), 200);
            this.points = floor(random(5, 12));
        }
        if (this.pos.y > height - this.height / 2 || this.pos.y < this.height / 2) {
            this.velocity.y *= -1;
            this.color = color(random(200, 255), random(200, 255), random(100, 255), 200);
            this.points = floor(random(5, 12));
        }
    }

    drawStar(x, y, radius1, radius2, npoints) {
        let angle = TWO_PI / npoints;
        let halfAngle = angle / 2.0;
        beginShape();
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = x + cos(a) * radius2;
            let sy = y + sin(a) * radius2;
            vertex(sx, sy);
            sx = x + cos(a + halfAngle) * radius1;
            sy = y + sin(a + halfAngle) * radius1;
            vertex(sx, sy);
        }
        endShape(CLOSE);
    }
}

// Helper functions
function createShapes(type, num) {
    for (let i = 0; i < num; i++) {
        // Check if we've reached the maximum number of shapes
        if (shapes[type].length >= settings.maxShapes) return;

        let x = random(50, width - 50);
        let y = random(50, height - 50);

        if (type === 'boxes') {
            shapes.boxes.push(new Box(x, y));
        } else if (type === 'stars') {
            shapes.stars.push(new Star(x, y));
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
        "- 'S': Save screenshot",
        "- 'D': Delete all shapes",
        "- 'T': Toggle shape type (box/star)",
        "- 'C': Toggle collision detection"
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

// Event handlers
function keyPressed() {
    // Toggle trail effect with spacebar
    if (keyCode === 32) {
        settings.trail = !settings.trail;
    }

    // Toggle between boxes and stars with 'T'
    if (key === 't' || key === 'T') {
        settings.showStars = !settings.showStars;
        if (settings.showStars && shapes.stars.length === 0) {
            createShapes('stars', 5);
        }
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
        shapes.stars = [];
    }
}

function mouseWheel(event) {
    if (event.delta < 0) {
        // Add shapes when scrolling up
        if (settings.showStars) {
            createShapes('stars', 5);
        } else {
            createShapes('boxes', 5);
        }
    } else {
        // Remove shapes when scrolling down
        if (settings.showStars) {
            removeShapes('stars', 5);
        } else {
            removeShapes('boxes', 5);
        }
    }

    // Prevent default scrolling behavior
    return false;
}

// Add mouse interaction
function mouseDragged() {
    // Create a shape at the mouse position when dragging
    if (settings.showStars) {
        shapes.stars.push(new Star(mouseX, mouseY));
        if (shapes.stars.length > settings.maxShapes) {
            shapes.stars.shift(); // Remove oldest star if we exceed the limit
        }
    } else {
        shapes.boxes.push(new Box(mouseX, mouseY));
        if (shapes.boxes.length > settings.maxShapes) {
            shapes.boxes.shift(); // Remove oldest box if we exceed the limit
        }
    }
}