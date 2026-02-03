# Umbraco Extending the Backoffice

Course contains several knowledge checks exercises. Below are the questions presented in these knowledge checks.

## Exercise 1: Setting up an extension with vanilla JavaScript

2. *Fill in the missing words*
   - To register an extension you need to have an `App_Plugins` folder in the root of your project.
   - An extension is registered in an `umbraco-package.json` file.

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
   - In your umbraco-package.json file, add an extension of the `icons` type.
   - This extension must point to a file containing `an array of icons`, each of which has a name property and a path property that points to a JavaScript file.
   - Each of these JavaScript files must export `an .svg file`.

## Exercise 5: Building a simple property editor

1. *What is the primary purpose of a property editor?*
   - To input and manage specific types of data in the backoffice

2. *The `propertyEditorSchemaAlias` determines what can be saved on the property. Which of these is NOT a valid `propertyEditorSchemaAlias`?*
   - `Umbraco.Plain.Html`

3. *Which of these statements are true? (select multiple)*
   - Use `@state` when you need to manage internal state that does not need to be accessed outside of the component.
   - Use `@property` when you want to expose a property that can be set from outside the component.
   - Both `@state` and `@property` decorators automatically trigger a re-render of the component when their values change, ensuring the UI stays in sync with the underlying data.

4. *How can you add custom configuration to a property editor? (fill in the blanks)*
   - Add configuration fields to the `properties` field in the `meta` field in the `umbraco-package.json` file.
   - Create properties in your element and retrieve the configuration data using the method `getValueByAlias` from `UmbPropertyEditorConfigCollection`.
   - Utilize the retrieved data in the component.

## Exercise 6: Building an advanced property editor

1. *Which steps are recommended to use an **Umbraco** modal in the backoffice? (drag and drop the steps)*
   - Import the necessary elements from the Umbraco modal node module.
   - Consume the modal manager context in the constructor.
   - Bind a UI element to a method that opens the modal.
   - Use the Modal Manager Context to open the modal and do something on submit.

2. *Complex data in the value property of an advanced property editor can be handled by defining a TypeScript type or interface. What are the benefits of handling the data in this way, rather than handling it as a primitive data type (e.g. string)? (select multiple)*
   - It allows data to be organized in a structured format, making it easy to represent complex relationships between data (e.g. nested content and arrays).
   - It’s easier to enforce type safety (i.e. ensuring a specific field holds the correct data type) and validate data formats.
   - It’s easier to access and modify individual elements (e.g. a string could require complex string manipulation to extract data).

3. *The getter method runs whenever the value property is accessed externally (e.g. by Umbraco). The setter method runs whenever the value property is set or updated externally. Check the two statements that are true.*
   - When the document is saved the getter runs to return the current state of the value property to Umbraco.
   - When the component is initialized the setter runs to update the component’s internal state with the value from Umbraco.

## Exercise 7: Custom API endpoint and Swagger

1. *You can restrict access to your API to authenticated backoffice users with this controller attribute:*
   - `[Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]`

2. *What must be implemented in derived classes of `BackOfficeSecurityRequirementsOperationFilterBase`?*
   - The `ApiName` property

3. *In version 14 and up, Umbraco includes built-in support for Swagger. You can view the Swagger documentation for your projetc’s API’s at:*
   - `{yourdomain}/umbraco/swagger`

4. *You can configure Swagger to document your custom API endpoints and use the SwaggerGenOptions class from the Swashbuckle library to customize various aspects of the Swagger output, such as: (select multiple)*
   - Individual parts of the documentation (parameters, request bodies, operations, schemas).
   - How the API routes and models are documented.

## Exercise 8: Backoffice authentication token and displaying fetched data

2. *Fill in the missing words*
   - Using `types` or `interfaces` in TypeScript when handling complex data ensures that the data conforms to a defined structure, improving type safety, code reliability, and making it easier to catch errors during development.