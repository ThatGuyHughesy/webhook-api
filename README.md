# Webhook API

A small webhook server

## Table of contents

- [Getting Started](#getting-started)
- [API](#api)
- [Testing](#testing)
- [Notes](#notes)
- [Author](#author)

## Getting Started

### Step 1: Set up the development environment

Install [Node.js and NPM](https://nodejs.org/en/download/)

> This project was developed using Node.js v16.x

### Step 2: Install dependencies

```bash
npm install
```

> This installs all dependencies with NPM.

### Step 3: Configure

Copy the `.env.example` file and rename it to `.env`. In this file you have to set the following:

`PORT`: The port the server will run on e.g. 9876

`WEBHOOK_MAX_RETRIES`: The maximum number of times a failed webhook will be retried .e.g. 5

`WEBHOOK_RETRY_INTERVAL_SECONDS`: The number of seconds between each retry e.g. 10

### Step 3: Serve your App

```bash
npm run dev:ts
```

> This starts a local server using `nodemon`, which watches for file changes and will restart the server accordingly.
> The server should run on `http://localhost:9876`.

## API

### GET /api/webhooks

Returns all registered webhooks

**Response**

No registered webhooks

```json
{
  "success": true,
  "data": {
    "webhooks": []
  }
}
```

One (or more) registered webhooks

```json
{
  "success": true,
  "data": {
    "webhooks": [
      {
        "url": "https://requestbin.fullcontact.com/rf385urf",
        "token": "foo"
      }
    ]
  }
}
```

Error

```json
{
  "error": "An error message"
}
```

### POST /api/webhooks

Registers a webhook

**Parameters**

|    Name | Required |  Type  | Description                 |
| ------: | :------: | :----: | --------------------------- |
|   `url` |   true   |  URL   | The URL to send the webhook |
| `token` |   true   | string | The authentication key      |

**Response**

Success

```json
{
  "success": true,
  "data": {
    "url": "https://requestbin.fullcontact.com/rf385urf",
    "token": "foo"
  }
}
```

Error

```json
{
  "error": "An error message"
}
```

### POST /api/wehooks/test

Triggers all registered webhooks.

**Parameters**

|      Name | Required | Type | Description                  |
| --------: | :------: | :--: | ---------------------------- |
| `payload` |   true   | JSON | The data sent in the webhook |

**Response**

Success

```json
{
  "success": true
}
```

Error

```json
{
  "error": "An error message"
}
```

## Testing

```bash
npm run test
```

## Notes

The endpoint `GET /api/webhooks/` was added for testing purposes.

Schema validation was added to POST requests e.g. `url` must be a valid URL.

Logging was added to improve debugging.

The webhook error handling strategy chosen was exponential backoff.

Node's `EventEmitter` was used to create an event-driven architecture for sending and retrying webhooks.

## Author

Conor Hughes - thatguyhughesy@proton.me
