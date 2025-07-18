/**
 * Main Application Logic for Panasonic TV Web App
 * Handles app initialization, navigation, and content management
 */

class PanasonicTVApp {
    constructor() {
        this.currentSection = 'home';
        this.isInitialized = false;
        this.loadingTimeout = null;
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('Initializing Panasonic TV App...');
        
        this.showLoading();
        
        try {
            // Wait for all components to be ready
            await this.waitForComponents();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize navigation
            this.setupNavigation();
            
            // Load initial content
            this.showSection('home');
            
            // Hide loading screen
            this.hideLoading();
            
            this.isInitialized = true;
            console.log('App initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize application');
        }
    }

    /**
     * Wait for all required components to be ready
     */
    async waitForComponents() {
        return new Promise((resolve) => {
            const checkComponents = () => {
                if (window.panasonicAPI && window.remoteControl) {
                    resolve();
                } else {
                    setTimeout(checkComponents, 100);
                }
            };
            checkComponents();
        });
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Navigation button clicks
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                this.handleNavigation(event.target.id);
            });
        });

        // Handle window resize for responsive behavior
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle visibility change (when app loses/gains focus)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Custom events
        document.addEventListener('sectionChange', (event) => {
            this.onSectionChange(event.detail);
        });
    }

    /**
     * Set up navigation system
     */
    setupNavigation() {
        // Map button IDs to section names
        this.navigationMap = {
            'home-btn': 'home',
            'media-btn': 'media',
            'settings-btn': 'settings',
            'about-btn': 'about'
        };
    }

    /**
     * Handle navigation button clicks
     */
    handleNavigation(buttonId) {
        const sectionName = this.navigationMap[buttonId];
        if (sectionName) {
            this.showSection(sectionName);
        }
    }

    /**
     * Show specific content section
     */
    showSection(sectionName) {
        console.log(`Switching to section: ${sectionName}`);
        
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
            
            // Load section-specific content
            this.loadSectionContent(sectionName);
            
            // Dispatch section change event
            const event = new CustomEvent('sectionChange', {
                detail: { 
                    previous: this.currentSection,
                    current: sectionName 
                }
            });
            document.dispatchEvent(event);
        }
    }

    /**
     * Load content for specific section
     */
    async loadSectionContent(sectionName) {
        const section = document.getElementById(`${sectionName}-section`);
        if (!section) return;

        switch (sectionName) {
            case 'home':
                this.loadHomeContent(section);
                break;
            case 'media':
                this.loadMediaContent(section);
                break;
            case 'settings':
                this.loadSettingsContent(section);
                break;
            case 'about':
                this.loadAboutContent(section);
                break;
        }
    }

    /**
     * Load home section content
     */
    loadHomeContent(section) {
        // Home content is static, but we could add dynamic elements here
        console.log('Home content loaded');
    }

    /**
     * Load media section content
     */
    loadMediaContent(section) {
        // Add media-specific content
        if (!section.querySelector('.media-grid')) {
            const mediaGrid = document.createElement('div');
            mediaGrid.className = 'media-grid';
            mediaGrid.innerHTML = `
                <div class="media-item">
                    <h3>Sample Video</h3>
                    <p>Example media content for your TV app</p>
                    <button class="media-button">Play</button>
                </div>
                <div class="media-item">
                    <h3>Sample Audio</h3>
                    <p>Audio content example</p>
                    <button class="media-button">Play</button>
                </div>
                <div class="media-item">
                    <h3>Photo Gallery</h3>
                    <p>View photos and images</p>
                    <button class="media-button">View</button>
                </div>
            `;
            
            // Add after existing content
            section.appendChild(mediaGrid);
            
            // Add media-specific styles
            this.addMediaStyles();
        }
        
        console.log('Media content loaded');
    }

    /**
     * Load settings section content
     */
    loadSettingsContent(section) {
        // Add settings-specific content
        if (!section.querySelector('.settings-grid')) {
            const settingsGrid = document.createElement('div');
            settingsGrid.className = 'settings-grid';
            settingsGrid.innerHTML = `
                <div class="setting-item">
                    <h3>Display Settings</h3>
                    <p>Adjust display preferences</p>
                    <button class="setting-button">Configure</button>
                </div>
                <div class="setting-item">
                    <h3>Audio Settings</h3>
                    <p>Configure audio options</p>
                    <button class="setting-button">Configure</button>
                </div>
                <div class="setting-item">
                    <h3>Network Settings</h3>
                    <p>Manage network connections</p>
                    <button class="setting-button">Configure</button>
                </div>
                <div class="setting-item">
                    <h3>App Settings</h3>
                    <p>Application preferences</p>
                    <button class="setting-button">Configure</button>
                </div>
            `;
            
            section.appendChild(settingsGrid);
            this.addSettingsStyles();
        }
        
        console.log('Settings content loaded');
    }

    /**
     * Load about section content
     */
    loadAboutContent(section) {
        // Add system information if available
        if (window.panasonicAPI && !section.querySelector('.system-info')) {
            const systemInfo = window.panasonicAPI.getSystemInfo();
            const networkInfo = window.panasonicAPI.getNetworkInfo();
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'system-info';
            infoDiv.innerHTML = `
                <h3>System Information</h3>
                <p><strong>Model:</strong> ${systemInfo.model}</p>
                <p><strong>Version:</strong> ${systemInfo.version}</p>
                <p><strong>Platform:</strong> ${systemInfo.platform}</p>
                <p><strong>Network:</strong> ${networkInfo.connected ? 'Connected' : 'Disconnected'}</p>
                <p><strong>Connection Type:</strong> ${networkInfo.type}</p>
            `;
            
            section.appendChild(infoDiv);
            this.addSystemInfoStyles();
        }
        
        console.log('About content loaded');
    }

    /**
     * Add media-specific styles
     */
    addMediaStyles() {
        if (!document.getElementById('media-styles')) {
            const style = document.createElement('style');
            style.id = 'media-styles';
            style.textContent = `
                .media-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 30px;
                }
                
                .media-item {
                    background: rgba(0, 0, 0, 0.4);
                    padding: 25px;
                    border-radius: 10px;
                    border: 2px solid #4a90e2;
                    transition: all 0.3s ease;
                }
                
                .media-item:hover {
                    transform: scale(1.05);
                    border-color: #ffffff;
                }
                
                .media-item h3 {
                    color: #4a90e2;
                    margin-bottom: 10px;
                    font-size: 24px;
                }
                
                .media-button {
                    background: #4a90e2;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 5px;
                    font-size: 20px;
                    cursor: pointer;
                    margin-top: 15px;
                    transition: all 0.3s ease;
                }
                
                .media-button:hover,
                .media-button:focus {
                    background: #357abd;
                    transform: scale(1.05);
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Add settings-specific styles
     */
    addSettingsStyles() {
        if (!document.getElementById('settings-styles')) {
            const style = document.createElement('style');
            style.id = 'settings-styles';
            style.textContent = `
                .settings-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 20px;
                    margin-top: 30px;
                }
                
                .setting-item {
                    background: rgba(44, 62, 80, 0.6);
                    padding: 25px;
                    border-radius: 10px;
                    border-left: 5px solid #4a90e2;
                }
                
                .setting-item h3 {
                    color: #4a90e2;
                    margin-bottom: 10px;
                    font-size: 24px;
                }
                
                .setting-button {
                    background: transparent;
                    color: #4a90e2;
                    border: 2px solid #4a90e2;
                    padding: 10px 20px;
                    border-radius: 5px;
                    font-size: 18px;
                    cursor: pointer;
                    margin-top: 15px;
                    transition: all 0.3s ease;
                }
                
                .setting-button:hover,
                .setting-button:focus {
                    background: #4a90e2;
                    color: white;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Add system info styles
     */
    addSystemInfoStyles() {
        if (!document.getElementById('system-info-styles')) {
            const style = document.createElement('style');
            style.id = 'system-info-styles';
            style.textContent = `
                .system-info {
                    background: rgba(0, 0, 0, 0.4);
                    padding: 30px;
                    border-radius: 10px;
                    margin-top: 30px;
                    border: 2px solid #4a90e2;
                }
                
                .system-info h3 {
                    color: #4a90e2;
                    margin-bottom: 20px;
                    font-size: 28px;
                }
                
                .system-info p {
                    margin-bottom: 10px;
                    font-size: 22px;
                }
                
                .system-info strong {
                    color: #4a90e2;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        console.log('Window resized');
        // Could adjust layout for different screen sizes
    }

    /**
     * Handle app visibility changes
     */
    handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            console.log('App hidden');
            // Pause any ongoing activities
        } else {
            console.log('App visible');
            // Resume activities
        }
    }

    /**
     * Handle section change events
     */
    onSectionChange(detail) {
        console.log(`Section changed from ${detail.previous} to ${detail.current}`);
    }

    /**
     * Show loading screen
     */
    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'flex';
        }
        
        // Set timeout to hide loading if it takes too long
        this.loadingTimeout = setTimeout(() => {
            this.hideLoading();
        }, 10000); // 10 seconds max
    }

    /**
     * Hide loading screen
     */
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
        
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        console.error(message);
        
        // Could implement a proper error display here
        alert(`Error: ${message}`);
    }

    /**
     * Get current app state
     */
    getState() {
        return {
            currentSection: this.currentSection,
            isInitialized: this.isInitialized,
            navigation: window.remoteControl ? window.remoteControl.getNavigationState() : null
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tvApp = new PanasonicTVApp();
});