# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.4.

## Running Application

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. 

## Using Application

The user is first navigated to the homepage.

![Image](https://github.com/user-attachments/assets/75a92905-d1d7-4753-ae6b-2e4119e2f400)

They can look through the navigation bar to see which page they would like to go to. They can browse through the list of shows in the tv shows list page. They have to have an account and be logged in to use the watchlist, rating, and commenting feature. To sign up or sign in, user can navigate to the page through the navigation bar floating at the side.

![Image](https://github.com/user-attachments/assets/765c0e28-7986-40e3-90df-dcb9f6539960)


## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running Cypress end-to-end test

After frontend and backend are running:
```bash
npx cypress open
```
Test run in google chrome.

(test 1) (Updated from previous cypress test due to changes in UI): Shows Button Navigation Test

![Image](https://github.com/user-attachments/assets/3495ced0-009f-4893-bdff-061c0fce6e79)

(test 2): Watchlist Button Navigation Test
![Image](https://github.com/user-attachments/assets/e3ef4fba-0bbf-4a24-8352-6ad82e7f4155)

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
