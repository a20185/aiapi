// @ts-ignore
import WebSocket from 'ws';
import { getFile } from './fetch';
// @ts-ignore
import crypto from 'crypto-js'
import { InputPromptTemplate, StandardPromptTemplate } from './translate';

const Domain = {
  General: 'general',
  GeneralV2: 'generalv2',
}

export interface XunfeiSparkSDKHeader {
  app_id: string;
  uid?: string;
}

export interface XunfeiSparkSDKChatParameter {
  domain: typeof Domain[keyof typeof Domain];
  temperature?: number;
  max_tokens?: number;
  top_k?: number;
  chat_id?: string;
}

export interface XunfeiSparkSDKMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface XunfeiSparkSDKPayload {
  message: {
    text: XunfeiSparkSDKMessage[];
  }
}

export interface XunfeiSparkSDKRequest {
  header: XunfeiSparkSDKHeader;
  parameter: {
    chat: XunfeiSparkSDKChatParameter;
  };
  payload: XunfeiSparkSDKPayload;
}

export interface XunfeiSparkSDKChoices {
  status: number;
  seq: number;
  text: {
    content: string;
    role: 'assistant';
    index: number;
  }[];
}

export interface XunfeiSparkSDKUsage {
  text: {
    question_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface XunfeiSparkSDKResponse {
  header: {
    code: number;
    message: string;
    sid: string;
    status: number;
  };
  payload: {
    choices: XunfeiSparkSDKChoices;
    usage: XunfeiSparkSDKUsage;
  };
}

export interface XunfeiSparkSDKChatConfig {
  domain: typeof Domain[keyof typeof Domain];
  temperature?: number;
  maxTokens?: number;
  topK?: number;
  chatId?: string;
}

export interface XunfeiSparkInitOptions {
    appId: string
    host?: string
    api_key: string;
    api_secret: string;
    model?: 'xunfei-spark-1.5' | 'xunfei-spark-2.0' 
    uid?: string
}

export class XunfeiSparkSDK {
  private _ws: WebSocket

  private _wsOpened: Promise<boolean>

  private _opts: XunfeiSparkInitOptions

  private _getUrlConfigs() {
    if (this._opts?.model === 'xunfei-spark-2.0') {
        return {
            path: 'wss://spark-api.xf-yun.com/v2.1/chat',
            domain: Domain.GeneralV2
        }
    }
    return {
        path: 'wss://spark-api.xf-yun.com/v1.1/chat',
        domain: Domain.General
    }
  }


  public constructor(opts: XunfeiSparkInitOptions) {
    const cfg = this._getUrlConfigs()
    this._opts = opts
    const host = opts.host ?? 'adapi.meituan.com'
    const date = (new Date()).toUTCString()
    const algorithm = 'hmac-sha256'
    const headers = 'host date request-line'
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`
    const signatureSha = crypto.HmacSHA256(signatureOrigin, opts.api_secret)
    const signature = crypto.enc.Base64.stringify(signatureSha)
    // eslint-disable-next-line
    const authorizationOrigin = `api_key="${opts.api_key}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
    // @ts-ignore eslint-disable-next-line
    const authorization = btoa(authorizationOrigin)
    // eslint-disable-next-line
    const url = `${cfg.path}?authorization=${authorization}&date=${date}&host=${host}`
    this._ws = new WebSocket(url);
    this._wsOpened = new Promise((resolve, reject) => {
      this._ws.on('open', () => resolve(true))
    })
    this._ws.on('error', (err: any) => {
      console.log('Error Occured!!!', err.message)
    })
  }

  private _translateParams(prompt: string, config?: StandardPromptTemplate) {
    const { modelName, params } = config?.modelConfig ?? { modelName: '', params: { maxTokens: 4096, temperature: 0.5 }};
    const { maxTokens, temperature } = params;
    const templateMessages = config?.templatePresets?.map(el => {
        return {
            role: el.role === 'user' ? el.role : 'assistant',
            content: el.content
        }
    }) ?? [];
    const userMsg = {
        role: 'user',
        content: prompt
    }
    const messages = [...templateMessages, userMsg]
    return {
        modelName,
        params,
        messages,
        maxTokens,
        temperature
    }
  }

  private _generateRequestId(): string {
    return `request_${Date.now()}`;
  }

  private _sendRequest(request: XunfeiSparkSDKRequest): Promise<XunfeiSparkSDKResponse['payload']> {
    return new Promise((resolve, reject) => {
      // jsonrpc: '2.0', id: requestId, method: 'chat', params: request
      const requestPayload = JSON.stringify({ ...request });
      // eslint-disable-next-line
      this._wsOpened.then(() => {
        let target = ''
        this._ws.send(requestPayload, (error: any) => {
          if (error) {
            reject(error);
          }
        });
  
        this._ws.on('message', (data: any) => {
          const response = JSON.parse(data);
          if (response.payload) {
            target += response.payload.choices?.text?.[0]?.content
            if (response.header.status === 2) {
              response.payload.choices.text[0].content = target
              resolve(response.payload);
            }
          }
        });
  
        this._ws.on('error', (error: any) => {
          reject(error);
        });
      })
    });
  }

  public async chat(prompt: string, cfgTemplate?: StandardPromptTemplate) {
    const requestConfig = this._translateParams(prompt, cfgTemplate)
    const cfg = this._getUrlConfigs()
    const request: XunfeiSparkSDKRequest = {
      header: {
        app_id: this._opts.appId,
        uid: this._opts.uid ?? this._generateRequestId(),
      },
      parameter: {
        chat: {
          domain: cfg.domain,
          temperature: requestConfig.temperature,
          max_tokens: requestConfig.maxTokens,
          top_k: 4
        },
      },
      payload: {
        message: {
          text: requestConfig.messages as any
        }
      },
    };

    const response = await this._sendRequest(request);
    const content = response;
    return content;
  }
}

