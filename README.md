# Umbraco Extending the Backoffice

A comprehensive training project demonstrating how to extend the Umbraco CMS backoffice using both vanilla JavaScript and modern frameworks (e.g. Lit, TypeScript and Vite).

## Overview

This repository contains practical examples and exercises for learning how to build custom extensions for the Umbraco backoffice. It covers multiple extension types and demonstrates both simple and advanced implementation approaches featuring:

- **Umbraco CMS 17.1.0** - Latest version of the leading .NET CMS.
- **uSync 17.0.2** - Content synchronization and deployment.
- **.NET 10.0** - Built on the latest .NET platform.
- **Lit 3.3.1** - For building the web components.
- **TypeScript 5.9.3** - For writing the advanced property editors in a strongly typed manner.
- **Vite 7.2.4** - For composing TypeScript files to Javscript files.

## Features

### Extension Examples

- **Vanilla JavaScript Extensions**
  - Dashboard extension
  - Header app extension
  - Section extension
  - Workspace view extension

- **Advanced Extensions (Lit + TypeScript + Vite)**
  - Custom dashboards with Umbraco contexts
  - Property editor UI
  - Advanced property editor
  - Custom modals
  - Workspace views
  - Custom icons

### Backend Components

- **AuditData API**: RESTful API for tracking recently edited items
- **Custom Services**: Dependency injection with `IAuditDataService`
- **Swagger Integration**: API documentation with custom operations filter
- **uSync**: Content synchronization support

## Getting Started

### Prerequisites

- [.NET 10.0 SDK](https://dotnet.microsoft.com/download) or later.
- A code editor (e.g. Visual Studio 2026, VS Code, or Rider).
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- SQL Server or SQL LocalDB for the database.

### Initial setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mvesign/umbraco-extending-the-backoffice.git
   cd umbraco-extending-the-backoffice
   ```

2. **Restore .NET dependencies**
   ```bash
   dotnet restore
   ```

3. **Install npm dependencies for the extension-training package**
   ```bash
   cd UmbracoExtendingTheBackoffice.Website/App_Plugins/extension-training
   npm install
   ```

4. **Build the TypeScript extensions**
   ```bash
   npm run build
   # or for development with watch mode:
   npm run watch
   ```

5. **Configure local appsettings**
   - Copy `appsettings.json` to `appsettings.Local.json`.
   - Update any settings in `appsettings.Local.json` as needed for your local environment.

6. **Setup a local database**
   - Create a new empty SQL Server or SQL LocalDB database.
   - Update the connection string in `appsettings.Local.json` to point to your local database.

7. **Run the application**
   ```bash
   cd UmbracoExtendingTheBackoffice.Website
   dotnet run
   ```

8. **Access the site**
   - Navigate to `https://localhost:XXXX` (check console output for actual port).
   - Complete the Umbraco installation wizard.
   - Login to the backoffice at `/umbraco`.

## Development Configuration
The project uses local configuration overrides for development:

- Copy `appsettings.json` to `appsettings.Local.json` for local settings.
- `appsettings.Local.json` is loaded in DEBUG mode and ignored by git.

## License

See [LICENSE](LICENSE) file for details.