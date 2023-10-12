# AIAPI - Claude2 LLM client (OhMyGPT Provide)

This documentation provides an overview of the OMG Claude2 service and its available functions. The OMG Claude2 service offers various functionalities for interacting with the Claude2 model.


## Why aiapi?
aiapi provide the minimum implementation for the LLM/App api, you can easily use it at no much efforts. It's especially suitable for anyone to test / run an ai-based app prototype.


## Installation
```shell
# installation via npm
npm install @aiapi/claude-omg --save

# installation via yarn
yarn add @aiapi/claude-omg --save

# installation via pnpm
pnpm install @aiapi/claude-omg --save
```


## Table of Contents
- [Simple OMG Claude2 Invocation](#simple-omg-claude2-invocation)
- [OMG Claude2 Template Invocation](#omg-claude2-template-invocation)
- use OmgClaudeService directly


## Simple OMG Claude2 Invocation

Calls the OMG's Claude2 service based on the given image source address, prompt, and appKey.

### Usage

```typescript
import { simpleCallOmgClaude, OmgClaudeSimpleCallParam } from '@aiapi/claude-omg'

const params: OmgClaudeSimpleCallParam = {
    mirrorType: 'base', // optional values: 'base' | 'mirror_1' | 'mirror_2' | 'mirror_3'
    content: 'Your content here',
    key: 'Your API key'
}

const response: Promise<string> = simpleCallOmgClaude(params);
```

### Parameters

- `params` (OmgClaudeSimpleCallParam): An object containing the following parameters:
  - `mirrorType` (string, optional): Image source address, optional values: 'base' | 'mirror_1' | 'mirror_2' | 'mirror_3'.
  - `content` (string): The content for Claude2 processing.
  - `key` (string): The API key for authentication.

### Returns

- `response` (Promise<string>): A promise that resolves to a string representing the API's response.

## OMG Claude2 Template Invocation

Calls the OMG's Claude2 service based on the given template JSON, input parameters, and appKey.

### Usage

```typescript
import { callOmgClaude, OmgClaudeTemplateCallParam } from '@aiapi/claude-omg'

// Example template JSON:
const template: OmgClaudeTemplateCallParam = {
    url: 'https://example.com/template.json',
    content: 'Your content here',
    key: 'Your API key'
}

// Alternatively, you can provide the template content directly:
// const template: OmgClaudeTemplateCallParam = {
//     tpl: '{ "template": "content"}',
//     content: 'Your content here',
//     key: 'Your API key'
// }

const response: Promise<string> = callOmgClaude(template);
```

### Parameters

- `template` (OmgClaudeTemplateCallParam): An object containing the following parameters:
  - `url` (string): The URL of the template JSON file.
  - `content` (string): The content for Claude2 processing.
  - `key` (string): The API key for authentication.

### Returns

- `response` (Promise<string>): A promise that resolves to a string representing the API's response.
