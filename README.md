# Dockyard - Beautifull, Fast & Simple Docker Client

Dockyard is a modern, fast, and user-friendly Docker client designed to simplify container management on Linux. Built with Rust + Tauri and React.js, Dockyard offers a sleek interface and powerful features, making it easier than ever to work with Docker containers.

![Dockyard banner](https://i.ibb.co/j6DWMDy/Dockyard-banner-2.jpg)


## Key Features

- **Intuitive UI**: A clean and simple interface designed for both beginners and advanced users.
- **Real-time Stats**: Monitor container stats in real-time with beautiful charts and graphs.
- **Container Management**: Easily create, start, stop, and remove containers with just a few clicks.
- **Volume Management**: Manage Docker volumes efficiently, including viewing attached containers.
- **Network Management**: Create and manage Docker networks.
- **Log Viewer**: Integrated log viewer for real-time container logs with PatternFly support.
- **Fast Performance**: Built with Rust for speed and reliability.

## Screenshots

![Dockyard Dashboard](https://i.ibb.co/3R5NttL/image.png)



## Installation

### Prerequisites

- Linux (currently supported only on Linux-based systems)
- Docker installed and running
- Node.js (for development and building from source)
- Rust (for building from source)

### Install Dockyard

You can download the latest release from [GitHub Releases](#) and install it using the following commands:

#### Using .deb file
```bash
# Download the latest .deb package
wget https://github.com/yourusername/dockyard/releases/download/vX.Y.Z/dockyard_X.Y.Z_amd64.deb

# Install the package
sudo dpkg -i dockyard_X.Y.Z_amd64.deb

# If there are missing dependencies, run
sudo apt-get install -f

```


#### Using AppImage file
```bash
# Download the latest release
wget https://github.com/ropali/dockyard/releases/download/vX.Y.Z/dockyard-X.Y.Z.AppImage

# Make it executable
chmod +x dockyard-X.Y.Z.AppImage

# Run Dockyard
./dockyard-X.Y.Z.AppImage
```

### Build from Source

To build Dockyard from source, follow these steps:

```bash
# Clone the repository
git clone https://github.com/ropali/dockyard.git
cd dockyard

# Install dependencies
npm install

# Build the Rust backend
cargo build --release

# Run the app in development mode
npm run tauri dev
```

## Usage

Dockyard is designed to be simple and intuitive. Once installed, launch the application and start managing your Docker containers, volumes, and networks. 

### Example Tasks

- **Start a Container**: Go to the "Containers" tab, select a container, and click "Start."
- **View Logs**: Select a running container and view its logs in real-time in the "Logs" tab.
- **Monitor Stats**: Go to the "Stats" tab to see live performance metrics for your containers.

## Contributing

We welcome contributions from the community! To get started:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add YourFeature'`).
5. Push to the branch (`git push origin feature/YourFeature`).
6. Open a Pull Request.

For more details, check out our [Contributing Guidelines](CONTRIBUTING.md).

## Development Setup

To set up a development environment:

1. Clone the repository: `git clone https://github.com/yourusername/dockyard.git`
2. Navigate to the project directory: `cd dockyard`
3. Install Node.js dependencies: `yarn install`
4. Build the Rust backend: `cargo build --release`
5. Run the app in development mode: `cargo tauri dev`

## Roadmap

- **Windows and macOS Support**: Extend Dockyard to support more operating systems.
- **Advanced Container Management**: Add features like container resource limits and custom network configurations.
- **Improved Logging**: Enhance the log viewer with search and filtering capabilities.
- **Plugin System**: Allow third-party plugins to extend Dockyard’s functionality.

## License

Dockyard is licensed under the [MIT License](LICENSE).

## Acknowledgements

- Built with [Tauri](https://tauri.app/), [React.js](https://reactjs.org/), and [Rust](https://www.rust-lang.org/).
- Inspired by the simplicity and power of Docker Desktop.
- Thanks to all the contributors who have helped make Dockyard what it is today.

## Community

Join the Dockyard community on [Discord](#) or follow us on [Twitter](#) for updates and discussions.

## Support

If you encounter any issues, please report them on our [GitHub Issues](https://github.com/ropali/dockyard/issues) page.

