# ERouter

ERouter is a flexible routing framework for Express.js, designed to help developers load and organize routes dynamically from the file system. With built-in middleware support and structured logging, ERouter aims to simplify route management for scalable Express applications.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
   - [Setting Up Routes](#setting-up-routes)
   - [Middleware](#middleware)
   - [Route Example](#route-example)
   - [Dynamic Routing](#dynamic-routing)
3. [Logger Configuration](#logger-configuration)
4. [Project Structure](#project-structure)
5. [License](#license)

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/TheOldZoom/ERouter.git
   cd ERouter
   ```

2. Install the dependencies:

   ```bash
   bun install
   ```

3. Start the server:
   ```bash
   bun start
   ```

By default, the server will run on `http://localhost:3002`. You can change the port in your `.env` file or directly in the code.

---

## Usage

### Setting Up Routes

Routes in ERouter are automatically loaded from the `src/routes` directory. Each route is represented by a file, and its path is determined by the folder structure. Here's how to structure your routes:

1. **Create a Route**: Inside the `src/routes` folder, create a route file. For example, `src/routes/hello/index.ts` will automatically be available at the `/hello` endpoint.

2. **Define Route Handlers**: A route file should export a `Router` instance and define route handlers (e.g., `GET`, `POST`). Here's an example of how to define a simple `GET` endpoint:

```ts
import { Router } from "../structures/Router";

const router = new Router();

router.get((req, res) => {
  res.json({
    message: "Hello World",
  });
});

export default router;
```

This will respond to `GET /hello` with `{ message: "Hello World" }`.

---

### Middleware

You can add middleware to your routes by creating a `_middleware.ts` file in the same folder as the route file. Middleware is executed in the order it's defined, and it can be applied globally or per route.

1. **Global Middleware**: If you want middleware for all routes, place `_middleware.ts` in the root of `src/routes`.

2. **Route-Specific Middleware**: For specific routes, place `_middleware.ts` in the folder of that route. Here's an example:

```ts
// src/routes/hello/_middleware.ts
import { Request, Response, NextFunction } from "express";
import Logger from "../../structures/Logger";

const logger = new Logger({ appName: "Router" });

function logRequest(req: Request, res: Response, next: NextFunction) {
  logger.info(`Request path: ${req.path}`);
  next();
}

export default [logRequest];
```

In the example above, the `logRequest` middleware will log the path of each request to the `/hello` route.

---

### Route Example

Consider a scenario where you need a route with both `GET` and `POST` methods.

1. **Create a route**: Let's say the route is `src/routes/users/index.ts`.

2. **Define the handlers**:

```ts
import { Router } from "../../structures/Router";

const router = new Router();

// GET /users
router.get((req, res) => {
  res.json({ message: "Fetching all users" });
});

// POST /users
router.post((req: Request, res: Response) => {
  if (!req.body?.name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }
  const { name } = req.body;

  res.json({ message: `User ${name} created` });
});

export default router;
```

Now, your `GET /users` and `POST /users` routes are set up. If you visit `/users` with a `GET` request, you’ll get a response like `{ message: "Fetching all users" }`, and a `POST` request will return `{ message: "User [name] created" }`.

---

### Dynamic Routing

ERouter automatically handles dynamic routes based on the file name. For example, if you create a file named `[id].ts` inside a route folder, it will automatically be mapped to a dynamic route such as `/users/:id`.

1. **Create a dynamic route**: Place the file `src/routes/users/[id].ts`.

2. **Define the handler**:

```ts
import { Router } from "../../structures/Router";

const router = new Router();

// GET /users/:id
router.get((req, res) => {
  const { id } = req.params;
  res.json({ message: `User ID: ${id}` });
});

export default router;
```

Now, a `GET` request to `/users/123` will return `{ message: "User ID: 123" }`.

---

## Logger Configuration

ERouter includes a built-in logger with support for different log levels, timestamps, and color-coding. You can configure the logger in the `Logger.ts` file or customize it per route.

**Available Log Levels**:

- `DEBUG`
- `INFO`
- `WARN`
- `ERROR`

The logger's behavior can be configured with the following options:

- **`appName`**: The name of your app (e.g., `"Router"`).
- **`minLevel`**: The minimum log level to display (e.g., `Logger.LOG_LEVELS.INFO`).
- **`showTimestamp`**: Whether to display timestamps in logs (default: `true`).
- **`showLogLevel`**: Whether to display the log level (default: `true`).
- **`colors`**: Enable or disable color-coding of log messages (default: `true`).

```ts
const logger = new Logger({
  appName: "Router",
  minLevel: Logger.LOG_LEVELS.DEBUG,
  showTimestamp: true,
  showLogLevel: true,
  colors: true,
});
```

---

## Project Structure

```
.
├── bun.lock
├── LICENSE
├── package.json
├── README.md
├── src
│   ├── index.ts
│   ├── interfaces
│   │   ├── ILogger.ts
│   │   └── IRoute.ts
│   ├── routes
│   │   ├── hello
│   │   │   └── index.ts
│   │   ├── _middleware.ts
│   │   └── users
│   │       ├── [id].ts
│   │       └── index.ts
│   └── structures
│       ├── Logger.ts
│       ├── RouteLoader.ts
│       └── Router.ts
└── tsconfig.json
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
