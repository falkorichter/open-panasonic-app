/**
 * Firefox OS API Integration for Panasonic TVs
 * Handles Firefox OS specific APIs available on Panasonic TV platform
 */

class FirefoxOSAPI {
    constructor() {
        this.isFirefoxOS = this.detectFirefoxOS();
        this.capabilities = this.getFirefoxOSCapabilities();
        this.init();
    }

    /**
     * Detect if running on Firefox OS
     */
    detectFirefoxOS() {
        // Check for Firefox OS specific indicators
        return !!(
            navigator.mozApps ||
            navigator.mozSettings ||
            navigator.mozPower ||
            (window.navigator && navigator.userAgent.includes('Mobile; rv:')) ||
            (window.navigator && navigator.userAgent.includes('Firefox'))
        );
    }

    /**
     * Initialize Firefox OS features
     */
    init() {
        console.log('Initializing Firefox OS API...');
        console.log('Firefox OS detected:', this.isFirefoxOS);
        console.log('Firefox OS capabilities:', this.capabilities);

        if (this.isFirefoxOS) {
            this.initFirefoxOSFeatures();
        }
    }

    /**
     * Get Firefox OS capabilities
     */
    getFirefoxOSCapabilities() {
        const capabilities = {
            apps: !!navigator.mozApps,
            settings: !!navigator.mozSettings,
            power: !!navigator.mozPower,
            battery: !!navigator.mozBattery || !!navigator.battery,
            deviceStorage: !!navigator.getDeviceStorage,
            systemXHR: !!window.XMLHttpRequest,
            activities: !!navigator.mozSetMessageHandler,
            deviceLight: !!window.DeviceLightEvent,
            deviceProximity: !!window.DeviceProximityEvent
        };

        return capabilities;
    }

    /**
     * Initialize Firefox OS specific features
     */
    initFirefoxOSFeatures() {
        // Initialize app management
        if (this.capabilities.apps) {
            this.initAppManagement();
        }

        // Initialize device storage access
        if (this.capabilities.deviceStorage) {
            this.initDeviceStorage();
        }

        // Initialize system settings
        if (this.capabilities.settings) {
            this.initSystemSettings();
        }

        // Initialize activities
        if (this.capabilities.activities) {
            this.initActivities();
        }

        // Initialize power management
        if (this.capabilities.power) {
            this.initPowerManagement();
        }
    }

    /**
     * Initialize app management features
     */
    initAppManagement() {
        try {
            // Get information about the current app
            const request = navigator.mozApps.getSelf();
            request.onsuccess = () => {
                const app = request.result;
                if (app) {
                    console.log('App manifest:', app.manifest);
                    console.log('App origin:', app.origin);
                }
            };
            request.onerror = (error) => {
                console.warn('Could not get app info:', error);
            };
        } catch (error) {
            console.warn('App management not available:', error);
        }
    }

    /**
     * Initialize device storage access
     */
    initDeviceStorage() {
        try {
            // Access to different storage areas
            this.videoStorage = navigator.getDeviceStorage('videos');
            this.musicStorage = navigator.getDeviceStorage('music');
            this.pictureStorage = navigator.getDeviceStorage('pictures');

            console.log('Device storage initialized');
        } catch (error) {
            console.warn('Device storage not available:', error);
        }
    }

    /**
     * Initialize system settings
     */
    initSystemSettings() {
        try {
            this.settings = navigator.mozSettings;
            console.log('System settings available');
        } catch (error) {
            console.warn('System settings not available:', error);
        }
    }

    /**
     * Initialize Firefox OS activities
     */
    initActivities() {
        try {
            // Handle view activity for media files
            navigator.mozSetMessageHandler('activity', (activityRequest) => {
                const activityName = activityRequest.source.name;
                console.log('Activity received:', activityName);

                if (activityName === 'view') {
                    this.handleViewActivity(activityRequest);
                }
            });
        } catch (error) {
            console.warn('Activities not available:', error);
        }
    }

    /**
     * Initialize power management
     */
    initPowerManagement() {
        try {
            this.power = navigator.mozPower;
            
            // Prevent screen from turning off during video playback
            this.keepScreenOn = () => {
                if (this.power && this.power.screenEnabled !== undefined) {
                    this.power.screenEnabled = true;
                }
            };

            console.log('Power management available');
        } catch (error) {
            console.warn('Power management not available:', error);
        }
    }

    /**
     * Handle view activity for media files
     */
    handleViewActivity(activityRequest) {
        const data = activityRequest.source.data;
        console.log('View activity data:', data);

        // Handle different media types
        if (data.type && data.type.startsWith('video/')) {
            this.handleVideoFile(data);
        } else if (data.type && data.type.startsWith('audio/')) {
            this.handleAudioFile(data);
        } else if (data.type && data.type.startsWith('image/')) {
            this.handleImageFile(data);
        }

        // Post result back to activity caller
        activityRequest.postResult({ success: true });
    }

    /**
     * Handle video file viewing
     */
    handleVideoFile(data) {
        console.log('Handling video file:', data);
        // Implementation would depend on app structure
        // Could trigger navigation to video player section
        const event = new CustomEvent('firefoxos-video', { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * Handle audio file playback
     */
    handleAudioFile(data) {
        console.log('Handling audio file:', data);
        // Implementation would depend on app structure
        const event = new CustomEvent('firefoxos-audio', { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * Handle image file viewing
     */
    handleImageFile(data) {
        console.log('Handling image file:', data);
        // Implementation would depend on app structure
        const event = new CustomEvent('firefoxos-image', { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * Get system setting value
     */
    async getSystemSetting(key) {
        if (!this.settings) {
            return null;
        }

        try {
            const request = this.settings.createLock().get(key);
            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result[key]);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.warn('Could not get setting:', key, error);
            return null;
        }
    }

    /**
     * Set system setting value
     */
    async setSystemSetting(key, value) {
        if (!this.settings) {
            return false;
        }

        try {
            const setting = {};
            setting[key] = value;
            
            const request = this.settings.createLock().set(setting);
            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.warn('Could not set setting:', key, value, error);
            return false;
        }
    }

    /**
     * Get device storage files
     */
    async getStorageFiles(storageType, path = '') {
        let storage;
        
        switch (storageType) {
            case 'videos':
                storage = this.videoStorage;
                break;
            case 'music':
                storage = this.musicStorage;
                break;
            case 'pictures':
                storage = this.pictureStorage;
                break;
            default:
                return [];
        }

        if (!storage) {
            return [];
        }

        try {
            const request = storage.enumerate(path);
            const files = [];

            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    const file = request.result;
                    if (file) {
                        files.push(file);
                        request.continue();
                    } else {
                        resolve(files);
                    }
                };
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.warn('Could not enumerate storage files:', error);
            return [];
        }
    }

    /**
     * Launch another app
     */
    async launchApp(appOrigin) {
        if (!this.capabilities.apps) {
            return false;
        }

        try {
            const request = navigator.mozApps.getInstalled();
            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    const apps = request.result;
                    const targetApp = apps.find(app => app.origin === appOrigin);
                    
                    if (targetApp) {
                        targetApp.launch();
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                };
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.warn('Could not launch app:', error);
            return false;
        }
    }

    /**
     * Start an activity
     */
    startActivity(name, data) {
        if (!window.MozActivity) {
            console.warn('MozActivity not available');
            return null;
        }

        try {
            const activity = new MozActivity({
                name: name,
                data: data
            });

            activity.onsuccess = () => {
                console.log('Activity completed successfully');
            };

            activity.onerror = () => {
                console.warn('Activity failed:', activity.error);
            };

            return activity;
        } catch (error) {
            console.warn('Could not start activity:', error);
            return null;
        }
    }
}

// Initialize Firefox OS API when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.firefoxOSAPI = new FirefoxOSAPI();
});