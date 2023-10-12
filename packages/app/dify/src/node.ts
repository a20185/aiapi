import https from 'https';
import { DifyCompletionCallParamsExp } from './types';
import { getDifyApiConfig } from './config';

/**
 * ### Dify Completion API【Experimental Version】
 * Returns a Promise that resolves to a string using the provided parameters.
 *
 * @param {DifyCompletionCallParamsExp} params - Parameters for the API call.
 * 
 * @param {string} params.query - The text content to be supplemented
 * @param {string} params.bearerKey - AIDA application AppId
 * @param {object} params.inputs - Variable content, formatted as a key-value pair object
 * @param {string} params.response_mode - Response mode, default is 'blocking'
 * @param {string} params.user - Username, if not filled, a random string will be generated
 * @param {string} params.conversationId - Conversation ID, if not filled, a random one will be generated
 * @return {Promise<string>} A Promise that resolves to a string, representing the API's response.
 * 
 */
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