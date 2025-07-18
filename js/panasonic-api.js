/**
 * Panasonic TV API Integration
 * Handles TV-specific functionality and API calls
 */

class PanasonicTVAPI {
    constructor() {
        this.isTV = this.detectTVEnvironment();
        this.capabilities = this.getCapabilities();
        this.init();
    }

    /**
     * Detect if running on Panasonic TV
     */
    detectTVEnvironment() {
        // Check user agent for Panasonic TV indicators
        const userAgent = navigator.userAgent.toLowerCase();
        const tvIndicators = [
            'panasonic',
            'viera',
            'ce-html',
            'hbbtv'
        ];
        
        // Check for Firefox OS indicators (since Panasonic TVs are Firefox OS-based)
        const firefoxOSIndicators = [
            'mobile; rv:',
            'firefox',
            'gecko'
        ];
        
        const hasTVIndicator = tvIndicators.some(indicator => userAgent.includes(indicator));
        const hasFirefoxOS = firefoxOSIndicators.some(indicator => userAgent.includes(indicator));
        
        // Also check for Firefox OS APIs
        const hasFirefoxOSAPIs = !!(
            navigator.mozApps ||
            navigator.mozSettings ||
            navigator.getDeviceStorage
        );
        
        return hasTVIndicator || (hasFirefoxOS && hasFirefoxOSAPIs);
    }

    /**
     * Initialize TV-specific features
     */
    init() {
        console.log('Initializing Panasonic TV API...');
        console.log('TV Environment detected:', this.isTV);
        console.log('Capabilities:', this.capabilities);

        if (this.isTV) {
            this.initTVSpecificFeatures();
        } else {
            this.initBrowserFallbacks();
        }
    }

    /**
     * Get TV capabilities and supported features
     */
    getCapabilities() {
        const capabilities = {
            remoteControl: true,
            networkInfo: false,
            systemInfo: false,
            mediaPlayer: false,
            fileSystem: false,
            firefoxOS: false
        };

        // Check for Panasonic-specific APIs
        if (typeof window.panasonic !== 'undefined') {
            capabilities.systemInfo = true;
            capabilities.networkInfo = true;
        }

        // Check for Firefox OS APIs (since Panasonic TVs are Firefox OS-based)
        if (navigator.mozApps) {
            capabilities.firefoxOS = true;
            capabilities.systemInfo = true;
        }

        if (navigator.getDeviceStorage) {
            capabilities.fileSystem = true;
        }

        if (navigator.mozSettings) {
            capabilities.systemInfo = true;
            capabilities.networkInfo = true;
        }

        // Check for media APIs
        if (typeof window.HTMLVideoElement !== 'undefined') {
            capabilities.mediaPlayer = true;
        }

        return capabilities;
    }

    /**
     * Initialize TV-specific features
     */
    initTVSpecificFeatures() {
        // Set up TV-specific event listeners
        this.setupTVKeyHandling();
        this.optimizeForTV();
        
        // Try to access Panasonic-specific APIs
        try {
            this.getSystemInfo();
            this.getNetworkInfo();
        } catch (error) {
            console.warn('Some Panasonic APIs not available:', error.message);
        }

        // Initialize Firefox OS features if available
        if (this.capabilities.firefoxOS && window.firefoxOSAPI) {
            console.log('Firefox OS features available - integrating with Panasonic TV');
            this.integrateFirefoxOSFeatures();
        }
    }

    /**
     * Initialize browser fallbacks for development
     */
    initBrowserFallbacks() {
        console.log('Running in browser mode - TV features simulated');
        
        // Simulate TV environment for development
        this.simulateTVEnvironment();
    }

    /**
     * Set up TV-specific key handling
     */
    setupTVKeyHandling() {
        // TV-specific key codes (may vary by model)
        this.tvKeyCodes = {
            RED: 403,
            GREEN: 404,
            YELLOW: 405,
            BLUE: 406,
            BACK: 461,
            MENU: 457,
            INFO: 457,
            EXIT: 27
        };

        // Handle TV-specific keys
        document.addEventListener('keydown', (event) => {
            this.handleTVKeys(event);
        });
    }

    /**
     * Handle TV-specific key presses
     */
    handleTVKeys(event) {
        const keyCode = event.keyCode;
        
        switch (keyCode) {
            case this.tvKeyCodes.RED:
                console.log('Red button pressed');
                event.preventDefault();
                break;
            case this.tvKeyCodes.GREEN:
                console.log('Green button pressed');
                event.preventDefault();
                break;
            case this.tvKeyCodes.YELLOW:
                console.log('Yellow button pressed');
                event.preventDefault();
                break;
            case this.tvKeyCodes.BLUE:
                console.log('Blue button pressed');
                event.preventDefault();
                break;
            case this.tvKeyCodes.BACK:
                console.log('Back button pressed');
                this.handleBackButton();
                event.preventDefault();
                break;
            case this.tvKeyCodes.MENU:
                console.log('Menu button pressed');
                event.preventDefault();
                break;
            case this.tvKeyCodes.EXIT:
                console.log('Exit button pressed');
                this.handleExitButton();
                event.preventDefault();
                break;
        }
    }

    /**
     * Handle back button press
     */
    handleBackButton() {
        // Custom back button logic
        const event = new CustomEvent('tvBackButton');
        document.dispatchEvent(event);
    }

    /**
     * Handle exit button press
     */
    handleExitButton() {
        // Confirm exit
        if (confirm('Exit application?')) {
            // In real TV environment, this would close the app
            if (this.isTV && window.close) {
                window.close();
            } else {
                // Browser fallback
                window.location.href = 'about:blank';
            }
        }
    }

    /**
     * Get system information
     */
    getSystemInfo() {
        try {
            // Try Panasonic-specific API first
            if (window.panasonic && window.panasonic.system) {
                return window.panasonic.system.getInfo();
            }
            
            // Try Firefox OS API as fallback
            if (navigator.mozApps && window.firefoxOSAPI) {
                return this.getFirefoxOSSystemInfo();
            }
        } catch (error) {
            console.warn('System info not available:', error.message);
        }
        
        // Fallback system info
        return {
            model: 'Unknown Panasonic TV',
            version: '1.0',
            platform: 'Panasonic TV (Firefox OS-based)'
        };
    }

    /**
     * Get network information
     */
    getNetworkInfo() {
        try {
            // Try Panasonic-specific API
            if (window.panasonic && window.panasonic.network) {
                return window.panasonic.network.getInfo();
            }
        } catch (error) {
            console.warn('Network info not available:', error.message);
        }
        
        // Fallback network info
        return {
            connected: navigator.onLine,
            type: 'ethernet'
        };
    }

    /**
     * Optimize performance for TV
     */
    optimizeForTV() {
        // Disable smooth scrolling for better performance
        document.documentElement.style.scrollBehavior = 'auto';
        
        // Reduce animations if performance is poor
        if (this.isLowPerformanceDevice()) {
            document.body.classList.add('reduced-motion');
        }
    }

    /**
     * Check if device has low performance
     */
    isLowPerformanceDevice() {
        // Simple performance check
        const startTime = performance.now();
        let iterations = 0;
        
        while (performance.now() - startTime < 10) {
            iterations++;
        }
        
        // If less than 100k iterations in 10ms, consider it low performance
        return iterations < 100000;
    }

    /**
     * Simulate TV environment for development
     */
    simulateTVEnvironment() {
        // Add simulation notice
        const notice = document.createElement('div');
        notice.innerHTML = '📺 TV Simulation Mode - Use arrow keys to navigate';
        notice.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(255, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 10000;
        `;
        document.body.appendChild(notice);
        
        // Simulate TV key mappings for development
        document.addEventListener('keydown', (event) => {
            if (event.altKey) {
                switch (event.key) {
                    case '1':
                        this.handleTVKeys({ keyCode: this.tvKeyCodes.RED, preventDefault: () => {} });
                        break;
                    case '2':
                        this.handleTVKeys({ keyCode: this.tvKeyCodes.GREEN, preventDefault: () => {} });
                        break;
                    case '3':
                        this.handleTVKeys({ keyCode: this.tvKeyCodes.YELLOW, preventDefault: () => {} });
                        break;
                    case '4':
                        this.handleTVKeys({ keyCode: this.tvKeyCodes.BLUE, preventDefault: () => {} });
                        break;
                }
            }
        });
    }

    /**
     * Show loading screen
     */
    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'flex';
        }
    }

    /**
     * Hide loading screen
     */
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    /**
     * Integrate Firefox OS features with Panasonic TV functionality
     */
    integrateFirefoxOSFeatures() {
        console.log('Integrating Firefox OS features...');
        
        // Listen for Firefox OS media events
        document.addEventListener('firefoxos-video', (event) => {
            console.log('Firefox OS video event:', event.detail);
            // Handle video playback request
        });

        document.addEventListener('firefoxos-audio', (event) => {
            console.log('Firefox OS audio event:', event.detail);
            // Handle audio playback request
        });

        document.addEventListener('firefoxos-image', (event) => {
            console.log('Firefox OS image event:', event.detail);
            // Handle image viewing request
        });
    }

    /**
     * Get system information using Firefox OS APIs
     */
    async getFirefoxOSSystemInfo() {
        if (!window.firefoxOSAPI) {
            return null;
        }

        try {
            // Get device information from Firefox OS
            const deviceInfo = await window.firefoxOSAPI.getSystemSetting('deviceinfo.hardware');
            const osInfo = await window.firefoxOSAPI.getSystemSetting('deviceinfo.os');
            
            return {
                model: deviceInfo || 'Panasonic TV',
                version: osInfo || '1.0',
                platform: 'Panasonic TV (Firefox OS)',
                firefoxOS: true
            };
        } catch (error) {
            console.warn('Could not get Firefox OS system info:', error);
            return null;
        }
    }
}

// Initialize TV API when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.panasonicAPI = new PanasonicTVAPI();
});