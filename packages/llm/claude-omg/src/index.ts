import { getFile } from './lib/fetch'
import { OmgClaudeService } from './lib/claude'
import { InputPromptTemplate, translateToStandardTemplate } from './lib/translate'

interface OmgClaudeSimpleCallParam {
    // template url
    mirrorType?: string
    // content
    content: string,
    // openai key
    key?: string
}


interface OmgClaudeTemplateUrlCallParam extends OmgClaudeSimpleCallParam {
    // template url
    url: string
}

interface OmgClaudeTemplateContentCallParam extends OmgClaudeSimpleCallParam {
    // template content
    tpl: string
}

type OmgClaudeTemplateCallParam = OmgClaudeTemplateUrlCallParam | OmgClaudeTemplateContentCallParam


function generateOmgClaudeRequester(tpl: InputPromptTemplate) {
    const stdTpl = translateToStandardTemplate(tpl)
    if (!stdTpl) return async () => {
        return { error: 'Calling Error: template not supported!' }
    }
    return async (content: string, accessToken: string, mirrorType?: string) => {
        const chatMessage = { role: 'user', content } as const
        const omgClaude = new OmgClaudeService(
            accessToken,
            mirrorType
        )
        try {
            // Request completion from ChatGPT
            const completion = await omgClaude.completeChat(content, false);
            const responseMessage = completion.choices[0].message;
            return {
                answer: responseMessage?.content ?? ''
            }
        } catch (error: any) {
            return { error: 'Caliing Error', message: error.message }
        }
    }
}


/**
 * ### Simple OMG Claude2 Invocation
 * Calls the OMG's Claude2 service based on the given image source address, prompt, and appKey
 * - @see https://aigptx.top to apply for appKey
 * 
 * And returns a Promise that resolves to a string using the provided parameters.
 *
 * @param {OmgClaudeSimpleCallParam} params - Parameters for the API call.
 * @param {string} params.mirrorType - Image source address, optional values 'base' | 'mirror_1' | 'mirror_2' | 'mirror_3'
 * @return {Promise<string>} A Promise that resolves to a string, representing the API's response.
 * 
 */
export async function simpleCallOmgClaude(params: Record<string, string>) {
    const { key, content, mirrorType } = params
    if (!key) {
        return { error: 'APIKEY Not Found' };
    }
    const omgClaude = new OmgClaudeService(
        key,
        mirrorType
    )
    try {
        // Request completion from ChatGPT
        const completion = await omgClaude.completeChat(content, false);
        const responseMessage = completion.choices[0].message;
        return {
            answer: responseMessage?.content ?? ''
        }
    } catch (error: any) {
        return { error: 'Caliing Error', message: error.message }
    }
}

/**
 * ### OmgClaude Template Invocation
 * Calls the OMG's Claude2 service based on the given template JSON, input parameters, and appKey
 * - @see https://aigptx.top to apply for appKey
 * 
 * And returns a Promise that resolves to a string using the provided parameters.
 * 
 * The template currently supports three formats:
 * - aida/dify template (you can copy and modify the aida application configuration JSON)
 * - promptknit template (you can copy and modify the promptknit.com application configuration JSON)
 * - ChatGPTNextWeb template (you can locally generate and supplement using the ChatGPT Next Web template)
 *
 * @param {OmgClaudeTemplateCallParam} params - Parameters for the API call.
 * @return {Promise<string>} A Promise that resolves to a string, representing the API's response.
 * 
 */
export async function callOmgClaude(params: OmgClaudeTemplateCallParam) {
    const { content, key, mirrorType } = params
    if (!key) {
        return { error: 'APIKEY Not Found' };
    }
    try {
        const tplStr = await ('url' in params ? getFile(params.url) : params.tpl) as string
        const tpl = JSON.parse(tplStr)
        // fillin tpl and message
        const result = await generateOmgClaudeRequester(tpl)(content, key, mirrorType)
        return result
    } catch (err) {
        const error = err as any
        // Log the error
        console.log('error', error.response || error);
        // Return an object containing the error message
        return { error: error.response || error.message };
    }
}
