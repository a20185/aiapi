# AIAPI - Minimax LLM client

This documentation provides an overview of the Minimax service and its available functions. The Minimax service offers various functionalities for interacting with the Minimax's abab large model.


## Why aiapi?
aiapi provide the minimum implementation for the LLM/App api, you can easily use it at no much efforts. It's especially suitable for anyone to test / run an ai-based app prototype.


## Installation
```shell
# installation via npm
npm install @aiapi/minimax --save

# installation via yarn
yarn add @aiapi/minimax --save

# installation via pnpm
pnpm install @aiapi/minimax --save
```


## API List
- [Simple Minimax Invocation](#simple-minimax-invocation)
- [Simple Minimax Invocation (Pro Version)](#simple-minimax-invocation-pro-version)
- [Minimax Template Invocation](#minimax-template-invocation)
- [Minimax Template Invocation (Pro Version)](#minimax-template-invocation-pro-version)
- Directly use Minimax service


## Simple Minimax Invocation

Calls the Minimax's abab large model service based on the given prompt and appKey.


### Usage

```typescript
import { simpleCallMinimax, MinimaxSimpleCallParam } from 'minimax-service'

const params: MinimaxSimpleCallParam = {
    model: 'abab-5.5-chat', // optional, default: abab-5.5-chat
    content: 'Your content here',
    key: 'Your API key',
    groupId: 'Your group ID'
}

const response: Promise<string> = simpleCallMinimax(params);
```

### Parameters

- `params` (MinimaxSimpleCallParam): An object containing the following parameters:
  - `model` (string, optional): Model type, optional values 'abab-5-chat' | 'abab-5.5-chat'. Default is 'abab-5.5-chat'.
  - `content` (string): The content for Minimax processing.
  - `key` (string): The API key for authentication.
  - `groupId` (string): The group ID for Minimax processing.

### Returns

- `response` (Promise<string>): A promise that resolves to a string representing the API's response.

## Simple Minimax Invocation (Pro Version)

Calls the Minimax's abab large model service based on the given prompt and appKey, interfacing with Minimax's ChatCompletionPro.

### Usage

```typescript
import { simpleCallMinimaxPro, MinimaxSimpleCallParam } from 'minimax-service'

const params: MinimaxSimpleCallParam = {
    model: 'abab-5.5-chat', // optional, default: abab-5.5-chat
    content: 'Your content here',
    key: 'Your API key',
    groupId: 'Your group ID'
}

const response: Promise<string> = simpleCallMinimaxPro(params);
```

### Parameters

- `params` (MinimaxSimpleCallParam): An object containing the following parameters:
  - `model` (string, optional): Model type, optional to fill. Currently, Minimax Pro only supports 'abab-5.5-chat'.
  - `content` (string): The content for Minimax processing.
  - `key` (string): The API key for authentication.
  - `groupId` (string): The group ID for Minimax processing.

### Returns

- `response` (Promise<string>): A promise that resolves to a string representing the API's response.

## Minimax Template Invocation

Calls the Minimax's abab large model service based on the given template JSON, input parameters, and appKey.

### Usage

```typescript
import { callMinimax, MinimaxTemplateCallParam } from 'minimax-service'

// Example template JSON:
const template: MinimaxTemplateCallParam = {
    url: 'https://example.com/template.json',
    content: 'Your content here',
    key: 'Your API key',
    groupId: 'Your group ID'
}

// Alternatively, you can provide the template content directly:
// const template: MinimaxTemplateCallParam = {
//     tpl: '{ "template": "content"}',
//     content: 'Your content here',
//     key: 'Your API key',
//     groupId: 'Your group ID'
// }

const response: Promise<string> = callMinimax(template);
```

### Parameters

- `template` (MinimaxTemplateCallParam): An object containing the following parameters:
  - `url` (string): The URL of the template JSON file.
  - `content` (string): The content for Minimax processing.
  - `key` (string): The API key for authentication.
  - `groupId` (string): The group ID for Minimax processing.

### Returns

- `response` (Promise<string>): A promise that resolves to a string representing the API's response.

## Minimax Template Invocation (Pro Version)

Calls the Minimax's abab large model service based on the given template JSON, input parameters, and appKey, interfacing with Minimax's ChatCompletionPro.

### Usage

```typescript
import { callMinimaxPro, MinimaxTemplateCallParam } from 'minimax-service'

// Example template JSON:
const template: MinimaxTemplateCallParam = {
    url: 'https://example.com/template.json',
    content: 'Your content here',
    key: 'Your API key',
    groupId: 'Your group ID'
}

// Alternatively, you can provide the template content directly:
// const template: MinimaxTemplateCallParam = {
//     tpl: '{ "template": "content"}',
//     content: 'Your content here',
//     key: 'Your API key',
//     groupId: 'Your group ID'
// }

const response: Promise<string> = callMinimaxPro(template);
```

### Parameters

- `template` (MinimaxTemplateCallParam): An object containing the following parameters:
  - `url` (string): The URL of the template JSON file.
  - `content` (string): The content for Minimax processing.
  - `key` (string): The API key for authentication.
  - `groupId` (string): The group ID for Minimax processing.

### Returns

- `response` (Promise<string>): A promise that resolves to a string representing the API's response.

