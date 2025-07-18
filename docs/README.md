# Panasonic TV Web App

This is a sample web application designed to run on Panasonic Smart TVs. It demonstrates basic TV app functionality including remote control navigation, TV-safe styling, and platform-specific optimizations.

## Features

- **Remote Control Navigation**: Full support for TV remote control input
- **TV-Safe Design**: Colors and layouts optimized for television displays
- **Responsive Layout**: Adapts to different TV screen resolutions
- **Performance Optimized**: Lightweight and efficient for TV hardware
- **Platform Detection**: Automatically detects TV vs browser environment

## Getting Started

### Development Mode

1. Install Node.js (version 14 or higher)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:8080 in your browser

### Testing on TV

1. Start the network server:
   ```bash
   npm run deploy:network
   ```
2. Access the app from your TV's web browser using your computer's IP address
3. Use your TV remote to navigate the interface

## Navigation

- **Arrow Keys**: Navigate between menu items
- **OK/Enter**: Select current item
- **Back**: Return to previous screen
- **Colored Buttons**: Special functions (if supported)

## Development Notes

- Use TV-safe colors (avoid pure white/black)
- Ensure text is readable from 10-foot viewing distance
- Test with actual TV hardware when possible
- Keep memory usage under 50MB
- Optimize for slower processors

## File Structure

```
├── index.html              # Main entry point
├── css/
│   ├── styles.css         # Main application styles
│   └── tv-safe.css        # TV-specific color and safety styles
├── js/
│   ├── app.js             # Main application logic
│   ├── remote-control.js  # Remote control handling
│   └── panasonic-api.js   # TV-specific API integration
├── config/
│   └── app-config.xml     # TV app configuration
└── assets/
    ├── images/            # App images and media
    └── icons/             # App icons
```

## Browser Compatibility

- Panasonic Smart TV Web Browser
- Modern desktop browsers (for development)
- Mobile browsers (limited functionality)

## Known Limitations

- Audio features require user interaction to start
- Some TV APIs may not be available in all models
- Performance varies by TV model and age
- Network features depend on TV connectivity

## Deployment Options

1. **USB Deployment**: Copy files to USB drive and run from TV
2. **Network Deployment**: Host on local network server
3. **Web Deployment**: Host on internet server (if TV supports external URLs)

## Troubleshooting

- **App won't load**: Check network connectivity and server address
- **Remote not working**: Verify focus management and key event handling
- **Performance issues**: Reduce animations and optimize media files
- **Display problems**: Check TV-safe color compliance

For more detailed information, see the [Development Plan](../DEVELOPMENT_PLAN.md).