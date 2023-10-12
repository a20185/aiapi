# AIAPI - Midjourney client (OhMyGPT Provide)

This documentation provides an overview of the OMG Midjourney service and its available functions. The OMG Midjourney service offers various functionalities for generating and operating on Midjourney images.


## Why aiapi?
aiapi provide the minimum implementation for the LLM/App api, you can easily use it at no much efforts. It's especially suitable for anyone to test / run an ai-based app prototype.


## Installation
```shell
# installation via npm
npm install @aiapi/midjourney-omg --save

# installation via yarn
yarn add @aiapi/midjourney-omg --save

# installation via pnpm
pnpm install @aiapi/midjourney-omg --save
```


## API Usage
- [OMG Midjourney Generation Invocation](#omg-midjourney-generation-invocation)
- [OMG Midjourney Operation Invocation](#omg-midjourney-operation-invocation)
- use MidjourneyService directly


## OMG Midjourney Generation Invocation

Calls the OMG's Midjourney service to generate a Midjourney image based on the given prompt and appKey.

### Usage

```typescript
import { simpleCreateMidjourneyImage, OmgMidjourneyCreateParam } from '@aiapi/midjourney-omg'

const params: OmgMidjourneyCreateParam = {
    prompt: 'Your prompt here',
    mirrorType: 'base', // optional values: 'base' | 'mirror_1' | 'mirror_2' | 'mirror_3'
    key: 'Your API key',
    generateType: 'NORMAL', // optional, default: 'NORMAL'
    progresser: (progress: any) => console.log(progress) // optional
}

const response: Promise<MidjourneySubmitData> = simpleCreateMidjourneyImage(params);
```

### Parameters

- `params` (OmgMidjourneyCreateParam): An object containing the following parameters:
  - `prompt` (string): The prompt for generating the Midjourney image.
  - `mirrorType` (string, optional): Image source address, optional values: 'base' | 'mirror_1' | 'mirror_2' | 'mirror_3'.
  - `key` (string): The API key for authentication.
  - `generateType` ('FAST' | 'NORMAL', optional): The generation mode, default is 'NORMAL'.
  - `progresser` ((progress: any) => any, optional): A progress callback function to receive progress updates.

### Returns

- `response` (Promise<MidjourneySubmitData>): A promise that resolves to the generated Midjourney image data.

## OMG Midjourney Operation Invocation

Calls the OMG's Midjourney service to perform an operation on a Midjourney image based on the given parameters.

### Usage

```typescript
import { operateMidjourneyImage, OmgMidjourneyOperateParam } from '@aiapi/midjourney-omg'

const params: OmgMidjourneyOperateParam = {
    actionId: 'Your action ID',
    taskId: 'Your task ID',
    mirrorType: 'base', // optional values: 'base' | 'mirror_1' | 'mirror_2' | 'mirror_3'
    key: 'Your API key',
    generateType: 'NORMAL', // optional, default: 'NORMAL'
    progresser: (progress: any) => console.log(progress) // optional
}

const response: Promise<MidjourneySubmitData> = operateMidjourneyImage(params);
```

### Parameters

- `params` (OmgMidjourneyOperateParam): An object containing the following parameters:
  - `actionId` (string): The ID of the action to be performed on the Midjourney image.
  - `taskId` (string): The ID of the previous task condition.
  - `mirrorType` (string, optional): Image source address, optional values: 'base' | 'mirror_1' | 'mirror_2' | 'mirror_3'.
  - `key` (string): The API key for authentication.
  - `generateType` ('FAST' | 'NORMAL', optional): The generation mode, default is 'NORMAL'.
  - `progresser` ((progress: any) => any, optional): A progress callback function to receive progress updates.

### Returns

- `response` (Promise<MidjourneySubmitData>): A promise that resolves to the modified Midjourney image data.
