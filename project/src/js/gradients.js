// Dynamic gradient background manager
class GradientManager {
  constructor() {
    this.gradients = [
      {
        name: 'Ember Glow',
        colors: ['#8B0000', '#CD5C5C', '#FF4500'],
        angle: 135
      },
      {
        name: 'Ash Storm',
        colors: ['#2C2C2C', '#4A4A4A', '#FF6B6B'],
        angle: 225
      },
      {
        name: 'Burning Sunset',
        colors: ['#FF4500', '#CD5C5C', '#2C2C2C'],
        angle: 180
      },
      {
        name: 'Smoldering Coal',
        colors: ['#2C2C2C', '#8B0000', '#4A4A4A'],
        angle: 315
      }
    ];
    
    this.currentGradient = 0;
    this.transitionTime = 15000; // Time in ms between gradient changes
    this.body = document.body;
  }
  
  start() {
    this.setGradient(this.currentGradient);
    
    // Change gradient periodically
    setInterval(() => {
      this.currentGradient = (this.currentGradient + 1) % this.gradients.length;
      this.setGradient(this.currentGradient);
    }, this.transitionTime);
  }
  
  setGradient(index) {
    const gradient = this.gradients[index];
    const { colors, angle } = gradient;
    
    const gradientString = `linear-gradient(${angle}deg, ${colors.join(', ')})`;
    
    this.body.style.backgroundImage = gradientString;
  }
  
  // Method to change gradient based on user input
  changeGradientBasedOnInput(input) {
    if (!input || input.trim() === '') return;
    
    // Simple algorithm to pick a gradient based on the first character
    const firstChar = input.charAt(0).toLowerCase();
    const charCode = firstChar.charCodeAt(0);
    
    // Map the character code to one of our gradients
    const gradientIndex = charCode % this.gradients.length;
    
    // Set the new gradient
    this.currentGradient = gradientIndex;
    this.setGradient(gradientIndex);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const gradientManager = new GradientManager();
  gradientManager.start();
  
  // Make it accessible globally for the main.js file
  window.gradientManager = gradientManager;
});