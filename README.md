# Bouncing Boxes Animation

An interactive animation featuring colorful bouncing boxes with customizable properties.

## Overview

This project creates a dynamic, interactive animation of bouncing boxes using p5.js. The boxes move around the screen, bouncing off walls and each other while changing colors upon collision. Users can interact with the animation through mouse and keyboard controls, and adjust various parameters through an interactive settings menu.

## Features

- **Interactive Controls**:
  - Mouse wheel: Add/remove boxes (5 at a time)
  - Mouse drag: Create boxes at cursor position
  - Spacebar: Toggle trail effect
  - 'H' key: Toggle help/settings menu
  - 'Q' key: Toggle square mode
  - 'B' key: Toggle 1px black border
  - 'S' key: Save screenshot as PNG
  - 'D' key: Delete all boxes

- **Customizable Settings** (via help menu):
  - Min/Max Size: Adjust the size range of boxes
  - Speed: Control how fast boxes move
  - Rotation: Set how quickly boxes rotate
  - Shape Count: Precisely control the number of boxes

- **Physics Simulation**:
  - Boxes bounce realistically off walls
  - Collision detection between boxes
  - Anti-stuck mechanism prevents boxes from getting trapped

- **Visual Effects**:
  - Random colors that change on collision
  - Optional trail effect
  - Rotation effect
  - Optional square mode
  - Optional borders

## How to Use

1. Open `index.html` in a web browser
2. Use the mouse wheel to add or remove boxes
3. Press 'H' to open the settings menu
4. Adjust sliders to customize the animation
5. Press 'S' to save a screenshot

## Technical Details

- Built with p5.js
- Uses object-oriented programming for box management
- Implements collision detection and resolution
- Responsive design that adapts to window size

## Customization

You can modify the default settings in the `settings` object at the top of the `sketch.js` file:

```javascript
let settings = {
    trail: false,
    maxShapes: 1000,
    padding: 20,
    minDistance: 80,
    squareMode: false,
    showBorder: true,
    showHelp: false,
    minSize: 30,
    maxSize: 70,
    speed: 5,
    rotationSpeed: 0.05
};
```

## License

This project is open source and available for personal and educational use.

## Credits

Created with p5.js (https://p5js.org/)