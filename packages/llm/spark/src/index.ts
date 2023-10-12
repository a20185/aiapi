import { getFile } from './lib/fetch'
import { MinimaxSDK } from './lib/minimax'
import { translateToStandardTemplate } from './lib/translate'

export interface MinimaxSimpleCallParam {
    // modeltype
    model?: string
    // content
    content: string,
    // appkey
    key: string
    // groupId
    groupId: string
}

interface MinimaxTemplateUrlCallParam extends Omit<MinimaxSimpleCallParam, 'model'> {
    // template url
    url: string
}

interface MinimaxTemplateContentCallParam extends Omit<MinimaxSimpleCallParam, 'model'> {
    // template content
    tpl: string
}

type MinimaxTemplateCallParam = MinimaxTemplateUrlCallParam | MinimaxTemplateContentCallParam

/**
 * ### Simple Minimax Invocation
 * Calls the Minimax's abab large model service based on the given prompt and appKey
 * - @see https://api.minimax.chat/ to apply for appKey
 * 
 * And returns a Promise that resolves to a string using the provided parameters.
 *
 * @param {MinimaxSimpleCallParam} params - API call parameters.
 * @param {string} params.model - Model type, optional values 'abab-5-chat' | 'abab-5.5-chat', default is abab-5.5-chat
 * @return {Promise<string>} A Promise that resolves to a string, representing the API's response.
 * 
 */
export async function simpleCallMinimax(params: MinimaxSimpleCallParam) {
    const { key, content, model, groupId } = params
    if (!key) {
        return { error: 'APIKEY Not Found' };
    }
    const minimaxSDK = new MinimaxSDK(key, groupId)
    try {
        // Request completion from Minimax
        const completion = await minimaxSDK.completeChat(content, model);
        const responseMessage = completion.reply
        return {
            answer: responseMessage ?? ''
        }
    } catch (error: any) {
        return { error: 'Caliing Error', message: error.message }
    }
}

/**
 * ### Simple Minimax Invocation (Pro Version)
 * Calls the Minimax's abab large model service based on the given prompt and appKey, interfacing with Minimax's ChatCompletionPro
 * - @see https://api.minimax.chat/ to apply for appKey
 * 
 * And returns a Promise that resolves to a string using the provided parameters.
 *
 * @param {MinimaxSimpleCallParam} params - API call parameters.
 * @param {string} params.model - Model type, optional to fill, currently Minimax Pro only supports abab-5.5-chat
 * @return {Promise<string>} A Promise that resolves to a string, representing the API's response.
 * 
 */
export async function simpleCallMinimaxPro(params: MinimaxSimpleCallParam) {
    const { key, content, model, groupId } = params
    if (!key) {
        return { error: '未提供 APIKEY' };
    }

    const minimaxSDK = new MinimaxSDK(key, groupId)
    try {
        // Request completion from ChatGPT
        const completion = await minimaxSDK.completeChatPro(content, model);
        console.log(completion)
        const responseMessage = completion.reply
        return {
            answer: responseMessage ?? ''
        }
    } catch (error: any) {
        return { error: 'Caliing Error', message: error.message }
    }
}

/**
 * ### Minimax Template Invocation
 * Calls the Minimax's abab large model service based on the given template JSON, input parameters, and appKey
 * - @see https://api.minimax.chat/ to apply for appKey
 * 
 * And returns a Promise that resolves to a string using the provided parameters.
 * 
 * The template currently supports three formats:
 * - aida/dify template (you can copy and modify the aida application configuration JSON)
 * - promptknit template (you can copy and modify the promptknit.com application configuration JSON)
 * - ChatGPTNextWeb template (you can locally generate and supplement using the ChatGPT Next Web template)
 *
 * @param {MinimaxTemplateCallParam} params - Parameters for the API call.
 * @return {Promise<string>} A Promise that resolves to a string, representing the API's response.
 * 
 */
export async function callMinimax(params: MinimaxTemplateCallParam) {
    const { content, groupId, key } = params
    if (!key) {
        return { error: 'APIKEY Not Found' };
    }
    try {
        const tplStr = await ('url' in params ? getFile(params.url) : params.tpl) as string
        const tpl = JSON.parse(tplStr)
        const minimaxSDK = new MinimaxSDK(key, groupId)
        const chatTemplate = translateToStandardTemplate(tpl)
        if (!chatTemplate) {
            return { error: 'Template not supported' }
        }
        // fillin tpl and message
        const result = await minimaxSDK.chat(content, chatTemplate)
        return result
    } catch (err) {
        const error = err as any
        // Log the error
        console.log('error', error.response || error);
        // Return an object containing the error message
        return { error: error.response || error.message };
    }
}

/**
 * ### Minimax Template Invocation (Pro Version)
 * Calls the Minimax's abab large model service based on the given template JSON, input parameters, and appKey, interfacing with Minimax's ChatCompletionPro
 * - @see https://api.minimax.chat/ to apply for appKey
 * 
 * And returns a Promise that resolves to a string using the provided parameters.
 * 
 * The template currently supports three formats:
 * - aida/dify template (you can copy and modify the aida application configuration JSON)
 * - promptknit template (you can copy and modify the promptknit.com application configuration JSON)
 * - ChatGPTNextWeb template (you can locally generate and supplement using the ChatGPT Next Web template)
 *
 * @param {MinimaxTemplateCallParam} params - Parameters for the API call.
 * @return {Promise<string>} A Promise that resolves to a string, representing the API's response.
 * 
 */
export async function callMinimaxPro(params: MinimaxTemplateCallParam) {
    const { content, groupId, key } = params
    if (!key) {
        return { error: 'APIKEY Not Found' };
    }
    try {
        const tplStr = await ('url' in params ? getFile(params.url) : params.tpl) as string
        const tpl = JSON.parse(tplStr)
        const minimaxSDK = new MinimaxSDK(key, groupId)
        const chatTemplate = translateToStandardTemplate(tpl)
        if (!chatTemplate) {
            return { error: 'Template not supported' }
        }
        // fillin tpl and message
        const result = await minimaxSDK.chatPro(content, chatTemplate)
        return result
    } catch (err) {
        const error = err as any
        // Log the error
        console.log('error', error.response || error);
        // Return an object containing the error message
        return { error: error.response || error.message };
    }
}
