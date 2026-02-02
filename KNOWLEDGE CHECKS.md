# Umbraco Extending the Backoffice

Course contains several knowledge checks exercises. Below are the questions presented in these knowledge checks.

## Exercise 1: Setting up an extension with vanilla JavaScript

2. *Fill in the missing words*
   - *To register an extension you need to have an `App_Plugins` folder in the root of your project.*
   - *An extension is registered in an `umbraco-package.json` file.*

3. *Which of these fields are mandatory in the umbraco-package.json file for every extension? (select multiple)*
   - `type`
   - `alias`
   - `element` or `js`

4. *What happens when you unregister an extension from the Extension Insights dashboard?*
   - It’s temporarily removed from the backoffice in the specific browser tab.

## Exercise 2: Setting up an extension with Lit, Vite and TypeScript

1. *Techstack: Drag and drop the descriptions to match the technology.*
   - Lit: A lightweight JavaScript library for building fast, reusable UI components.
   - TypeScript: A superset of JavaScript that adds typesafety and a lot of other great features for larger applications.
   - Vite: A fast build tool that bundles and optimizes code for development and production.

2. *You can install the backoffice node modules with this command: `npm install -D @umbraco-cms/backoffice`. Why is it important to have the node modules in your package?*
   - They contain the Lit UI components and custom Umbraco backoffice elements needed for building extensions.

3. *Why is it important to use the rollupOptions in the vite configuration file when you have the Umbraco node modules in your extension?*
   - It prevents bundling the Umbraco node modules with your package since they are already available in the browser via import maps.

4. *What happens when you run the command 'npm run build' in the extension-training folder?*
   1. The command executes the `build` script defined in the `package.json` file.
   2. The TypeScript compiler checks the `tsconfig.json` file for information about the compiling process.
   3. The TypeScript compiler performs type checking.
   4. The TypeScript compiler transpiles the TS code into JS code and converts TS features into their JS equivalents.
   5. Vite reads the `vite.config.ts` file that dictates how Vite should behave.
   6. Vite bundles and optimizes your files and writes them to the specified output directory.

5. *Which of these files is NOT required when using Vite with Lit and TypeScript?*
   - `.gitignore`: Specifies files and directories that Git should ignore (e.g., node_modules, dist).

## Exercise 3: Using Umbraco node modules, contexts and observables with UmbElementMixin

1. *What is a mixin in TypeScript?*
   - A class that can be used to add functionality to another class.

2. *UmbElementMixin helps you consume a context, provide context, observe a state, use localization and implement controllers. These things can all be done without using UmbElementMixin.*
   - True.

3. *What does UmbElementMixin provide when extended?*
   - A collection of methods for consuming APIs, managing state, and providing context.

4. *What does it mean to consume a context and how is this done?*
   - To use a context token to access and use shared data from an ancestor element.

## Exercise 4: Styling your extension with the Umbraco UI Library and custom icons

1. *UUI components work out-of-the-box in Umbraco 14+, no configuration or setup is required.*
   - True.

2. *What can you do at uui.umbraco.com? (select multiple)*
   - View documentation and usage examples of UI components.
   - Adjust component properties and see real-time changes in the UI and the component code.
   - Preview UI components.
   - Copy component code and use it directly in your projects.

4. *Fill in the blanks in the description of creating custom icons. These are some of the steps needed to create custom icons:*
   - *In your umbraco-package.json file, add an extension of the `icons` type.*
   - *This extension must point to a file containing `an array of icons`, each of which has a name property and a path property that points to a JavaScript file.*
   - *Each of these JavaScript files must export `an .svg file`.*