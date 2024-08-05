# user-management-frontend-vue

A web application built with Vue 3 that displays and manages a large dataset

## Project Setup

```sh
yarn
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
yarn test:unit
```

### Check Unit Test coverage

```sh
yarn test:unit-coverage
```

## Deployed Version

This application is deployed on Vercel and can be accessed [here](https://user-management-frontend-vue.vercel.app/)

## About the project

### Why was Vue 3 chosen over Vue 2?

- Coming from a React background, the organization of component logic in Vue 3 with Composition API felt closer to the usage of functional components and hooks in React.
- Better typescript support
- Why not start with the latest, especially when you are new to the framework.

### Architectural decisions

- Implemented modular, component-based architecture with Typescript.
- Leveraged Composition API for better and readable code organization
- Handled State management using Pinia for centralized data fetching and storage for users.
- Used the below folder structure for better code navigation

```sh
├── src
│   ├── components
│   │   ├── common
│   │   │   ├── Search.vue
│   │   │   └── Table.vue
│   │   └── UserList.vue
│   ├── constants
│   ├── interfaces
│   ├── router
│   ├── services
│   ├── stores
│   ├── utilities
│   ├── views
```

- Separate components for Search and Table for component reusability and separation of concerns.
- Different folders for different parts of the code to ensure that related functionalities are grouped together.

## Documentation

Complete documentation can be viewed [here](https://billowy-shock-849.notion.site/User-management-with-Vue-3-5a4b9867bcc74202b408fdcf32a1a601)
