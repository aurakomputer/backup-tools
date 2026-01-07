# All-in-One Backup Tools

All-in-One Backup Tools is a versatile backup solution built with [Bun.js](https://bun.sh), designed to simplify and automate the process of backing up your important files and directories. This project leverages Bun's speed and modern JavaScript features to provide a fast, reliable, and easy-to-use backup utility.

## Features

- 📦 Backup multiple directories or files with a single command
- ⚡ Super-fast execution powered by Bun.js
- 🔄 Incremental and full backup options
- 🗂️ Customizable backup destinations
- 📝 Simple configuration and usage

## Getting Started

### Prerequisites

- [Bun.js](https://bun.sh) v1.3.4 or later

### Installation

Install dependencies:

```bash
bun install
```

### Usage

To run a backup:

```bash
bun start backup
```

You can customize backup sources and destinations in the configuration file (see project docs for details).

## Project Structure

- `src/` - Source code for backup logic
- `backups/` - Backup destination directory
- `config.json` - Configuration files for backup settings
- `README.md` - Project documentation

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.

---

Project initialized with `bun init` using Bun v1.3.4.
