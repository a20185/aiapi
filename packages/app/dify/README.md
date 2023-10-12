# AIAPI - Dify App client

This documentation provides an overview of the Dify service and its available functions. The Dify service offers various functionalities for interacting with the Dify App model.


## Why aiapi?
aiapi provide the minimum implementation for the LLM/App api, you can easily use it at no much efforts. It's especially suitable for anyone to test / run an ai-based app prototype.


## Installation
```shell
# installation via npm
npm install @aiapi/dify --save

# installation via yarn
yarn add @aiapi/dify --save

# installation via pnpm
pnpm install @aiapi/dify --save
```


## API List
- [Dify Custom Configuration](#dify-custom-configuration)
- [Dify Completion API (Experimental Version)](#dify-completion-api-experimental-version)

## Dify Custom Configuration

Setup dify-compatible service with custom host settings.

### Usage

```typescript
import { setupDifyApi, DifyAppApiConfig } from '@aiapi/dify'

const config: DifyAppApiConfig = {
    customHost: 'api.dify.ai'
}

setupDifyApi(config);
```

### Parameters

- `conf` (DifyAppApiConfig): An object containing the following configuration parameters:
  - `customHost` (string): The custom host URL for the Dify service.

### Returns

- `void`


## Dify Completion API (Experimental Version)

Returns a Promise that resolves to a string using the provided parameters.

### Usage

```typescript
import { difyCompletion, DifyCompletionCallParamsExp } from '@aiapi/dify'

const params: DifyCompletionCallParamsExp = {
    query: 'Your query here',
    bearerKey: 'Your bearer key',
    inputs: { variable1: 'value1', variable2: 'value2' },
    response_mode: 'blocking', // optional, default: 'blocking'
    user: 'Your username', // optional, a random string will be generated if not specified
    conversationId: 'Your conversation ID' // optional, a random ID will be generated if not specified
}

const response: Promise<string> = difyCompletion(params);
```

### Parameters

- `params` (DifyCompletionCallParamsExp): An object containing the following parameters:
  - `query` (string): The text content to be supplemented.
  - `bearerKey` (string): AIDA application AppId.
  - `inputs` (object): Variable content, formatted as a key-value pair object.
  - `response_mode` (string, optional): Response mode, default is 'blocking'.
  - `user` (string, optional): Username, if not filled, a random string will be generated.
  - `conversationId` (string, optional): Conversation ID, if not filled, a random one will be generated.

### Returns

- `response` (Promise<string>): A promise that resolves to a string representing the API's response.