/* eslint-disable max-lines */
import http, { RequestOptions } from 'https';
import { getFile } from './fetch';
import { StandardPromptTemplate, translateToStandardTemplate } from './translate';

type KeySelectionType<T> = T[keyof T]

const MinimaxBaseModelType = {
    ABAB_V5Pro: 'abab5.5-chat',
    ABAB_V5: 'abab5-chat'
} as const

const MinimaxSensitiveWordType = {
    SEVERE_VIOLATION: 1,
    PORNOGRAPHY: 2,
    ADVERTISEMENT: 3,
    PROHIBITION: 4,
    INSULT: 5,
    TERRORISM: 6,
    OTHERS: 7,
} as const

export interface MinimaxChatCompletionResponse {
    created: number;
    model: KeySelectionType<typeof MinimaxBaseModelType>;
    reply: string;
    input_sensitive: boolean;
    input_sensitive_type?: KeySelectionType<typeof MinimaxSensitiveWordType>;
    output_sensitive: boolean;
    output_sensitive_type?: KeySelectionType<typeof MinimaxSensitiveWordType>;
    choices: MinimaxChatCompletionChoice[];
    usage: {
        total_tokens: number;
    };
    id: string;
    base_resp?: {
        status_code: number;
        status_msg: string;
    };
}

interface MinimaxChatCompletionRequestParam {
    model?: string
    prompt: string
    roleMeta: MinimaxRoleMeta
    messages: MinimaxMessage[]
    stream?: boolean
    useStandardSSE?: boolean
    beamWidth?: boolean
    continueLastMessage?: boolean
    tokensToGenerate?: number
    temperature?: number
    topP?: number
    skipInfoMask?: boolean
}

interface MinimaxChatCompletionChoice {
    text: string;
    index: number;
    finish_reason: string;
    delta?: string;
}

interface MinimaxRoleMeta {
    user_name: string;
    bot_name: string;
}

interface MinimaxMessage {
    sender_type: 'USER' | 'BOT';
    text: string;
}

export class MinimaxSDK {
    protected _token: string;

    protected _groupId: string;

    protected _reqPath: string;

    protected _reqPathPro: string;

    protected _apiUrl = 'api.minimax.chat';

    protected _basePath = '/v1/text/chatcompletion';

    protected _basePathPro = '/v1/text/chatcompletion_pro';

    public constructor(token: string, groupId: string) {
        this._groupId = groupId;
        this._token = token;
        this._reqPath = `${this._basePath}?GroupId=${groupId}`
        this._reqPathPro = `${this._basePathPro}?GroupId=${groupId}`
    }

    private sendRequest(options: RequestOptions, postData?: string): Promise<MinimaxChatCompletionResponse> {
        return new Promise<MinimaxChatCompletionResponse>((resolve, reject) => {
            const req = http.request(options, (res) => {
                let data = '';
                res.setEncoding('utf-8')

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        resolve(response);
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (postData) {
                req.write(postData);
            }

            req.end();
        });
    }

    private _cutoffModel(inputModel: string): string {
        switch (inputModel) {
            case MinimaxBaseModelType.ABAB_V5Pro:
            case MinimaxBaseModelType.ABAB_V5:
                return inputModel
            default:
                return MinimaxBaseModelType.ABAB_V5Pro
        }
    }

    public async chatPro(content: string, tpl: StandardPromptTemplate): Promise<MinimaxChatCompletionResponse> {
        const requestPayload = JSON.stringify({
            model: MinimaxBaseModelType.ABAB_V5Pro,
            stream: false,
            bot_setting: [
                {
                    bot_name: '智能助理',
                    content: tpl.templatePresets[0].content,
                }
            ],
            reply_constraints: {
                sender_type: 'BOT',
                sender_name: '智能助理'
            },
            messages: [{
                text: content,
                sender_name: '我',
                sender_type: 'USER'
            }],
            tokens_to_generate: tpl.modelConfig.params.maxTokens ?? 4096,
            temperature: tpl.modelConfig.params.temperature ?? 0.9,
            top_p: tpl.modelConfig.params.topP ?? 0.95,
            plugins: tpl.plugins ?? undefined,
            functions: tpl.functions ?? undefined,
            // sample_messages: tpl.fewShotMessages ?? undefined
        });

        const options: RequestOptions = {
            hostname: this._apiUrl,
            path: this._reqPathPro,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this._token}`,
                'Content-Type': 'application/json;charset=utf-8',
                'Content-Length': Buffer.byteLength(requestPayload),
            },
        };

        const completion = await this.sendRequest(options, requestPayload);
        return completion;

    }

    public async chat(content: string, tpl: StandardPromptTemplate): Promise<MinimaxChatCompletionResponse> {
        const requestPayload = JSON.stringify({
            model: this._cutoffModel(tpl.modelConfig.modelName),
            stream: false,
            prompt: tpl.templatePresets[0].content,
            role_meta: {
                user_name: '我',
                bot_name: '智能助理'
            },
            messages: [{
                text: content,
                sender_type: 'USER'
            }],
            tokens_to_generate: tpl.modelConfig.params.maxTokens ?? 4096,
            temperature: tpl.modelConfig.params.temperature ?? 0.9,
            top_p: tpl.modelConfig.params.topP ?? 0.95,
        });

        const options: RequestOptions = {
            hostname: this._apiUrl,
            path: this._reqPath,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this._token}`,
                'Content-Type': 'application/json;charset=utf-8',
                'Content-Length': Buffer.byteLength(requestPayload),
            },
        };

        const completion = await this.sendRequest(options, requestPayload);
        return completion;
    }

    public async completeChatPro(content: string, model?: string): Promise<MinimaxChatCompletionResponse> {
        const requestPayload = JSON.stringify({
            model: MinimaxBaseModelType.ABAB_V5Pro,
            stream: false,
            bot_setting: [
                {
                    bot_name: '智能助理',
                    content: '你是一名大语言模型智能助理，能帮助用户解决各种各样的问题。'
                }
            ],
            reply_constraints: {
                sender_type: 'BOT',
                sender_name: '智能助理'
            },
            messages: [{
                text: content,
                sender_name: '我',
                sender_type: 'USER'
            }],
            tokens_to_generate: 4096,
            temperature: 0.9,
            top_p: 0.95,
        });

        const options: RequestOptions = {
            hostname: this._apiUrl,
            path: this._reqPathPro,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this._token}`,
                'Content-Type': 'application/json;charset=utf-8',
                'Content-Length': Buffer.byteLength(requestPayload),
            },
        };

        console.log('RequestPayload:', requestPayload)
        const completion = await this.sendRequest(options, requestPayload);
        return completion;
    }

    public async completeChat(content: string, model?: string): Promise<MinimaxChatCompletionResponse> {
        const requestPayload = JSON.stringify({
            model: this._cutoffModel(model ?? ''),
            stream: false,
            prompt: '你是一名大语言模型智能助理，能帮助用户解决各种各样的问题。',
            role_meta: {
                user_name: '我',
                bot_name: '智能助理'
            },
            messages: [{ text: content, sender_type: 'USER' }],
            tokens_to_generate: 4096,
            temperature: 0.9,
            top_p: 0.95,
        });
        const options: RequestOptions = {
            hostname: this._apiUrl,
            path: this._reqPath,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this._token}`,
                'Content-Type': 'application/json;charset=utf-8',
                'Content-Length': Buffer.byteLength(requestPayload),
            },
        };

        console.log('RequestPayload:', requestPayload)
        const completion = await this.sendRequest(options, requestPayload);
        return completion;
    }
}