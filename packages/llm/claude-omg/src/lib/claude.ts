import http, { RequestOptions } from 'https';
import { getFile } from './fetch';
import { InputPromptTemplate, translateToStandardTemplate } from './translate';
interface OmgClaudeChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OmgClaudeChatCompletionChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface OmgClaudeChatCompletionChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

export class OmgClaudeService {
  private _token: string;

  private _urlAlternative: string

  private readonly _apiUrl = 'cfwus02.opapi.win';

  private readonly _mirrorA = 'x.dogenet.win';

  private readonly _mirrorB = 'aigptx.top';

  private readonly _mirrorC = 'textai.buzz';

  private readonly _claudeModel = 'claude-2-web';

  private readonly _basePath = '/v1/claude/web';


  private _selectMirror() {
    switch(this._urlAlternative) {
        case 'base':
            return this._apiUrl
        case 'mirror_1':
            return this._mirrorA
        case 'mirror_2':
            return this._mirrorB
        case 'mirrir_3':
            return this._mirrorC
        default:
            return this._apiUrl
    }
  }

  public constructor(token: string, _u = 'base') {
    this._token = token;
    this._urlAlternative = _u
  }

  private _sendRequest(options: RequestOptions, postData?: string): Promise<OmgClaudeChatCompletionResponse> {
    return new Promise<OmgClaudeChatCompletionResponse>((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';

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

  async completeChat(prompt: string, stream = false): Promise<OmgClaudeChatCompletionResponse> {
    const data = new URLSearchParams();
    data.append('model', this._claudeModel);
    data.append('prompt', prompt);
    data.append('stream', String(stream));

    const postData = data.toString();
    const options: RequestOptions = {
      hostname: this._selectMirror(),
      path: `${this._basePath}/completion`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${this._token}`,
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const completion = await this._sendRequest(options, postData);
    return completion;
  }
}
