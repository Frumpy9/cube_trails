let boxes = []
let stars = []

let trail = false;

//remove scrollbars
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    makeBoxes(1);
    // makeStars(10);
    document.documentElement.style.overflow = 'hidden';




}

function draw() {
    //display, update, bounce all boxes
    if (!trail) background(0);
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].display();
        boxes[i].update();
        boxes[i].bounce();
    }
    // //display, update, bounce all stars
    // for (let i = 0; i < stars.length; i++) {
    //     stars[i].display();
    //     stars[i].update();
    //     stars[i].bounce();
    // }



}



//make a box class
class Box {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.width = 50;
        this.height = 50;
        this.volicity = createVector(random(-5, 5), random(-5, 5));
        this.color = color(random(255), random(255), random(255));
    }
    display() {
        fill(this.color);
        rect(this.pos.x, this.pos.y, this.width, this.height);
    }
    update() {
        this.pos.add(this.volicity);
    }
    bounce() {// if it hits the side of a box
        if (this.pos.x > width - this.width || this.pos.x < 0) {
            this.volicity.x *= -1;
            this.changeColor(color(random(255), random(255), random(255)));

        }
        if (this.pos.y > height - this.height || this.pos.y < 0) {
            this.volicity.y *= -1;
            this.changeColor(color(random(255), random(255), random(255)));

        }

        //if the box hits another box it bounces off
        // for (let i = 0; i < boxes.length; i++) {
        //     if(this == boxes[i]) continue;
        //     if (this.pos.x < boxes[i].pos.x + boxes[i].width &&
        //         this.pos.x + this.width > boxes[i].pos.x &&
        //         this.pos.y < boxes[i].pos.y + boxes[i].height &&
        //         this.height + this.pos.y > boxes[i].pos.y) {
        //         this.volicity.x *= -1;
        //         this.volicity.y *= -1;
        //         this.changeColor(color(random(255), random(255), random(255)));

        //     }
        // }


    }

    changeColor(color) {
        this.color = color;
    }


}

// class Star {
//     constructor(x, y) {
//         this.pos = createVector(x, y);
        
//         this.volicity = createVector(random(-5, 5), random(-5, 5));
//         this.color = color(random(255), random(255), random(255));
//         this.radius1 = random(30, 80);
//         this.radius2 = random(60, 100);
//         this.width = 50;
//         this.height = this.radius2;
//         this.points = random(5, 16);
//     }
//     display() {
//         fill(this.color);
//         star(this.pos.x, this.pos.y, this.radius1, this.radius2, this.points);
//     }
//     update() {
//         this.pos.add(this.volicity);
//     }
//     bounce() {// if it hits the side of a box
//         if (this.pos.x > width - this.width || this.pos.x < 0) {
//             this.volicity.x *= -1;
//             this.changeColor(color(random(255), random(255), random(255)));
//             this.changePoints(random(5, 16));
//         }
//         if (this.pos.y > height - this.height || this.pos.y < 0) {
//             this.volicity.y *= -1;
//             this.changeColor(color(random(255), random(255), random(255)));
//             this.changePoints(random(5, 16));
//         }
//     }
//      changeColor(color) {
//         this.color = color;
//     }
//     changePoints(points) {
//         this.points = points;
//     }
// }



makeBoxes = (num) => {
    for (let i = 0; i < num; i++) {
        boxes.push(new Box(random(50, width - 50), random(50, height - 50)));
    }
}

// makeStars = (num) => {
//     for (let i = 0; i < num; i++) {
//         stars.push(new Star(random(50, width - 50), random(50, height - 50)));
//     }
// }

//when space is pressed toggle trail
function keyPressed() {
    if (keyCode === 32) {
        trail = !trail;
    }
}

//add and remove boxes when i scroll
function mouseWheel(event) {
    if (event.delta < 0) {
        makeBoxes(10);
    } else {
        //loop 10 times
        for (let i = 0; i < 10; i++) {
            boxes.pop();
        }
    }
}


// function star(x, y, radius1, radius2, npoints) {
//     let angle = TWO_PI / npoints;
//     let halfAngle = angle / 2.0;
//     beginShape();
//     for (let a = 0; a < TWO_PI; a += angle) {
//       let sx = x + cos(a) * radius2;
//       let sy = y + sin(a) * radius2;
//       vertex(sx, sy);
//       sx = x + cos(a + halfAngle) * radius1;
//       sy = y + sin(a + halfAngle) * radius1;
//       vertex(sx, sy);
//     }
//     endShape(CLOSE);
//   }

  //if s is pressed save a png of the canvas
function keyTyped() {
    if (key === 's') {
        saveCanvas('myCanvas', 'png');
    }
}

//if d is pressed delete all boxes
function keyTyped() {
    if (key === 'd') {
        boxes = [];
    }
}