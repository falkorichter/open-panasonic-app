/**
 * Remote Control Navigation Handler
 * Manages spatial navigation and remote control input for TV interface
 */

class RemoteControlHandler {
    constructor() {
        this.currentFocus = 0;
        this.navItems = [];
        this.isNavigating = false;
        this.init();
    }

    /**
     * Initialize remote control handling
     */
    init() {
        this.setupKeyListeners();
        this.updateNavItems();
        this.setInitialFocus();
        
        console.log('Remote control handler initialized');
    }

    /**
     * Set up keyboard event listeners for remote control
     */
    setupKeyListeners() {
        document.addEventListener('keydown', (event) => {
            this.handleKeyPress(event);
        });

        // Handle TV-specific back button
        document.addEventListener('tvBackButton', () => {
            this.handleBackNavigation();
        });
    }

    /**
     * Update navigation items list
     */
    updateNavItems() {
        this.navItems = Array.from(document.querySelectorAll('.nav-item'));
        console.log(`Found ${this.navItems.length} navigation items`);
    }

    /**
     * Set initial focus to first navigation item
     */
    setInitialFocus() {
        if (this.navItems.length > 0) {
            this.setFocus(0);
        }
    }

    /**
     * Handle key press events
     */
    handleKeyPress(event) {
        // Prevent default behavior for navigation keys
        const navigationKeys = [37, 38, 39, 40, 13, 32]; // Left, Up, Right, Down, Enter, Space
        
        if (navigationKeys.includes(event.keyCode)) {
            event.preventDefault();
            this.isNavigating = true;
        }

        switch (event.keyCode) {
            case 37: // Left arrow
                this.navigateLeft();
                break;
            case 38: // Up arrow
                this.navigateUp();
                break;
            case 39: // Right arrow
                this.navigateRight();
                break;
            case 40: // Down arrow
                this.navigateDown();
                break;
            case 13: // Enter/OK button
            case 32: // Space (alternative OK)
                this.activateCurrentItem();
                break;
            case 27: // Escape (Back button)
                this.handleBackNavigation();
                break;
            default:
                this.isNavigating = false;
                break;
        }
    }

    /**
     * Navigate left
     */
    navigateLeft() {
        if (this.currentFocus > 0) {
            this.setFocus(this.currentFocus - 1);
        } else {
            // Wrap to last item
            this.setFocus(this.navItems.length - 1);
        }
        this.playNavigationSound();
    }

    /**
     * Navigate right
     */
    navigateRight() {
        if (this.currentFocus < this.navItems.length - 1) {
            this.setFocus(this.currentFocus + 1);
        } else {
            // Wrap to first item
            this.setFocus(0);
        }
        this.playNavigationSound();
    }

    /**
     * Navigate up (could be used for vertical menus)
     */
    navigateUp() {
        // Currently using horizontal navigation, but this could be extended
        // for vertical menu systems or content navigation
        console.log('Navigate up');
    }

    /**
     * Navigate down (could be used for vertical menus)
     */
    navigateDown() {
        // Currently using horizontal navigation, but this could be extended
        // for vertical menu systems or content navigation
        console.log('Navigate down');
    }

    /**
     * Set focus to specific navigation item
     */
    setFocus(index) {
        // Remove active class from all items
        this.navItems.forEach((item, i) => {
            item.classList.remove('active');
            const button = item.querySelector('.nav-button');
            if (button) {
                button.blur();
            }
        });

        // Set new focus
        if (index >= 0 && index < this.navItems.length) {
            this.currentFocus = index;
            const currentItem = this.navItems[this.currentFocus];
            currentItem.classList.add('active');
            
            const button = currentItem.querySelector('.nav-button');
            if (button) {
                button.focus();
            }

            console.log(`Focus set to item ${index}`);
        }
    }

    /**
     * Activate current navigation item
     */
    activateCurrentItem() {
        const currentItem = this.navItems[this.currentFocus];
        if (currentItem) {
            const button = currentItem.querySelector('.nav-button');
            if (button) {
                this.playSelectionSound();
                button.click();
                console.log(`Activated item ${this.currentFocus}`);
            }
        }
    }

    /**
     * Handle back navigation
     */
    handleBackNavigation() {
        console.log('Back navigation triggered');
        
        // Could implement stack-based navigation here
        // For now, just go to home
        const homeButton = document.getElementById('home-btn');
        if (homeButton) {
            homeButton.click();
            this.setFocus(0); // Home is first item
        }
    }

    /**
     * Play navigation sound (if supported)
     */
    playNavigationSound() {
        try {
            // Try to play a subtle navigation sound
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // Audio not supported or blocked, silently continue
        }
    }

    /**
     * Play selection sound (if supported)
     */
    playSelectionSound() {
        try {
            // Try to play a selection confirmation sound
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.05);
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
        } catch (error) {
            // Audio not supported or blocked, silently continue
        }
    }

    /**
     * Enable spatial navigation for content areas
     */
    enableContentNavigation(contentElement) {
        if (!contentElement) return;

        const focusableElements = contentElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        let contentFocus = 0;

        const navigateContent = (direction) => {
            focusableElements[contentFocus].blur();
            
            switch (direction) {
                case 'up':
                    contentFocus = Math.max(0, contentFocus - 1);
                    break;
                case 'down':
                    contentFocus = Math.min(focusableElements.length - 1, contentFocus + 1);
                    break;
            }
            
            focusableElements[contentFocus].focus();
        };

        // Set initial focus
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        // Add content-specific key handler
        contentElement.addEventListener('keydown', (event) => {
            switch (event.keyCode) {
                case 38: // Up
                    event.preventDefault();
                    navigateContent('up');
                    break;
                case 40: // Down
                    event.preventDefault();
                    navigateContent('down');
                    break;
                case 37: // Left - return to main navigation
                case 39: // Right - return to main navigation
                    event.preventDefault();
                    this.setFocus(this.currentFocus);
                    break;
            }
        });
    }

    /**
     * Disable content navigation
     */
    disableContentNavigation(contentElement) {
        if (contentElement) {
            const focusableElements = contentElement.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            focusableElements.forEach(element => {
                element.blur();
            });
        }
    }

    /**
     * Get current navigation state
     */
    getNavigationState() {
        return {
            currentFocus: this.currentFocus,
            totalItems: this.navItems.length,
            isNavigating: this.isNavigating
        };
    }

    /**
     * Reset navigation to initial state
     */
    reset() {
        this.updateNavItems();
        this.setInitialFocus();
        this.isNavigating = false;
    }
}

// Initialize remote control handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.remoteControl = new RemoteControlHandler();
});