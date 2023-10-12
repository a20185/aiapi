import https from 'https';
import { DifyCompletionCallParamsExp } from './types';
import { getDifyApiConfig } from './config';

export function difyCompletion(params: DifyCompletionCallParamsExp): Promise<string> {
    const { query, bearerKey, inputs, response_mode, user, conversationId } = params
    return new Promise<string>((resolve, reject) => {
      const postData = JSON.stringify({
          inputs: inputs ?? {},
          query: query,
          response_mode: response_mode ?? 'blocking',
          user: user ?? Math.random().toString(36).slice(3),
          conversation_id: conversationId ?? undefined
      })
      const options: https.RequestOptions = {
        hostname: getDifyApiConfig().customHost,
        path: '/v1/chat-messages',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerKey}`,
          'Content-Type': 'application/json; chatset=utf-8',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, res => {
        let data = '';
        res.setEncoding('utf-8')
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      });
  
      req.on('error', error => {
        reject(error);
      });
      req.write(postData);
      req.end();
    });
  }