# AIAPI - XunfeiSpark LLM client

This documentation provides an overview of the Xunfei Spark service and its available functions. The Xunfei Spark service offers various functionalities for interacting with the Xunfei's Spark LLM(V1.5 / V2.0). Below are the details of each function:


## Why aiapi?
aiapi provide the minimum implementation for the LLM/App api, you can easily use it at no much efforts. It's especially suitable for anyone to test / run an ai-based app prototype.


## Installation
```shell
# installation via npm
npm install @aiapi/spark --save

# installation via yarn
yarn add @aiapi/spark --save

# installation via pnpm
pnpm install @aiapi/spark --save
```


## Table of Contents
- [Simple Xunfei Spark Invocation](#simple-xunfei-spark-invocation)
- [Xunfei Spark Template Invocation](#xunfei-spark-template-invocation)
- Directly use XunfeiSpark service


## Simple Xunfei Spark Invocation

Calls the Xunfei's Spark large model service based on the given prompt and appKey.

### Usage

```typescript
import { simpleCallXfSpark, XunfeiSparkSimpleCallParam } from '@aiapi/spark'

const params: XunfeiSparkSimpleCallParam = {
    model: 'xunfei-spark-2.0', // optional values: 'xunfei-spark-1.5' | 'xunfei-spark-2.0'
    content: 'Your content here',
    appId: 'Your app ID',
    key: 'Your API key',
    secret: 'Your API secret',
    uid: 'Your user ID', // optional
    host: 'https://yourhost.com' // optional
}

const response: Promise<string> = simpleCallXfSpark(params);
```

### Parameters

- `params` (XunfeiSparkSimpleCallParam): An object containing the following parameters:
  - `model` (string, optional): Model type, optional values: 'xunfei-spark-1.5' | 'xunfei-spark-2.0'.
  - `content` (string): The content for Xunfei Spark processing.
  - `appId` (string): The Xunfei app ID.
  - `key` (string): The Xunfei API key.
  - `secret` (string): The Xunfei API secret.
  - `uid` (string, optional): The user ID to identify the user.
  - `host` (string, optional): The custom host URL.

### Returns

- `response` (Promise<string>): A promise that resolves to a string representing the API's response.

## Xunfei Spark Template Invocation

Calls the Xunfei's Spark large model service based on the given template JSON, input parameters, and appKey.

### Usage

```typescript
import { callXfSpark, XunfeiSparkTemplateCallParam } from '@aiapi/spark'

// Example template JSON:
const template: XunfeiSparkTemplateCallParam = {
    url: 'https://example.com/template.json',
    content: 'Your content here',
    appId: 'Your app ID',
    key: 'Your API key',
    secret: 'Your API secret',
    uid: 'Your user ID', // optional
    host: 'https://yourhost.com' // optional
}

// Alternatively, you can provide the template content directly:
// const template: XunfeiSparkTemplateCallParam = {
//     tpl: '{ "template": "content"}',
//     content: 'Your content here',
//     appId: 'Your app ID',
//     key: 'Your API key',
//     secret: 'Your API secret',
//     uid: 'Your user ID', // optional
//     host: 'https://yourhost.com' // optional
// }

const response: Promise<string> = callXfSpark(template);
```

### Parameters

- `template` (XunfeiSparkTemplateCallParam): An object containing the following parameters:
  - `url` (string): The URL of the template JSON file.
  - `content` (string): The content for Xunfei Spark processing.
  - `appId` (string): The Xunfei app ID.
  - `key` (string): The Xunfei API key.
  - `secret` (string): The Xunfei API secret.
  - `uid` (string, optional): The user ID to identify the user.
  - `host` (string, optional): The custom host URL.

### Returns

- `response` (Promise<string>): A promise that resolves to a string representing the API's response.