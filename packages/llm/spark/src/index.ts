import { getFile } from './lib/fetch'
import { XunfeiSparkSDK } from './lib/spark'
import { translateToStandardTemplate } from './lib/translate'

interface XunfeiSparkSimpleCallParam {
    // llm-model usage, 'xunfei-spark-1.5' | 'xunfei-spark-2.0' 
    model?: string
    // content
    content: string,
    // xfapi Appkey
    appId: string
    // xfapi key
    key?: string
    // xfapi key
    secret: string
    // uid to judge which user
    uid?: string
    // host
    host?: string
}


interface XunfeiSparkTemplateUrlCallParam extends Omit<XunfeiSparkSimpleCallParam, 'model'> {
    // template url
    url: string
}

interface XunfeiSparkTemplateContentCallParam extends Omit<XunfeiSparkSimpleCallParam, 'model'> {
    // template content
    tpl: string
}

type XunfeiSparkTemplateCallParam = XunfeiSparkTemplateUrlCallParam | XunfeiSparkTemplateContentCallParam


/**
 * ### Simple Xunfei Spark Invocation
 * Calls the Xunfei's Spark large model service based on the given prompt and appKey
 * - @see https://console.xfyun.cn to apply for appKey
 * 
 * And returns a Promise that resolves to a string using the provided parameters.
 *
 * @param {XunfeiSparkSimpleCallParam} params - Parameters for the API call.
 * @param {string} params.model - Model type, optional values 'xunfei-spark-1.5' | 'xunfei-spark-2.0' 
 * @return {Promise<string>} A Promise that resolves to a string, representing the API's response.
 * 
 */
export async function simpleCallXfSpark(params: XunfeiSparkSimpleCallParam) {
    const { appId, key, secret, content, model, uid, host } = params
    if (!key) {
        return { error: 'APIKEY Not Found' };
    }
    const xfSDK = new XunfeiSparkSDK({
        appId: appId,
        api_key: key,
        api_secret: secret,
        model: model as any,
        uid,
        host
    })
    try {
        // Request completion from ChatGPT
        const completion = await xfSDK.chat(content);
        const responseMessage = completion.choices.text[0]
        return {
            answer: responseMessage?.content ?? ''
        }
    } catch (error: any) {
        return { error: 'Caliing Error', message: error.message }
    }
}

/**
 * ### Xunfei Spark Template Invocation
 * Calls the Xunfei's Spark large model service based on the given template JSON, input parameters, and appKey
 * - @see https://console.xfyun.cn to apply for Spark large model invocation permissions
 * 
 * And returns a Promise that resolves to a string using the provided parameters.
 * 
 * The template currently supports three formats:
 * - aida/dify template (you can copy and modify the aida application configuration JSON)
 * - promptknit template (you can copy and modify the promptknit.com application configuration JSON)
 * - ChatGPTNextWeb template (you can locally generate and supplement using the ChatGPT Next Web template)
 *
 * @param {XunfeiTemplateCallParam} params - Parameters for the API call.
 * @return {Promise<string>} A Promise that resolves to a string, representing the API's response.
 * 
 */
export async function callXfSpark(params: XunfeiSparkTemplateCallParam) {
    const { content, appId, key, secret, uid, host } = params
    if (!key) {
        return { error: 'APIKEY Not Found' };
    }
    try {
        const tplStr = await ('url' in params ? getFile(params.url) : params.tpl) as string
        const tpl = translateToStandardTemplate(JSON.parse(tplStr))
        const xfSDK = new XunfeiSparkSDK({
            appId: appId,
            api_key: key,
            api_secret: secret,
            model: tpl?.modelConfig.modelName as any,
            uid
        })
        // fillin tpl and message
        const result = await xfSDK.chat(content, tpl ?? undefined)
        return result
    } catch (err) {
        const error = err as any
        // Log the error
        console.log('error', error.response || error);
        // Return an object containing the error message
        return { error: error.response || error.message };
    }
}
