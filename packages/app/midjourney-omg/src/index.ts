import { getFile } from './lib/fetch'
import { OmgMidjourneyService, OmgMidjourneySubmitData } from './lib/midjourney'
import { InputPromptTemplate, translateToStandardTemplate } from './lib/translate'

interface OmgMidjourneyBaseParam {
    // template url
    mirrorType?: string
    // openai key
    key?: string
    // 生成模式，默认 Normal
    generateType?: 'FAST' | 'NORMAL'
    // Progresser
    progresser?: (...p: any[]) => any
}

interface OmgMidjourneyCreateParam extends OmgMidjourneyBaseParam {
    // content
    prompt: string
}

interface OmgMidjourneyOperateParam extends OmgMidjourneyBaseParam {
    // actionId - action to operate
    actionId: string
    // previous task condition
    taskId: string
}


/**
 * ### OMG Midjourney Generation Invocation
 * Calls the OMG's Midjourney service based on the given image source address, prompt, and appKey
 * - @see https://aigptx.top to apply for appKey
 * 
 * And returns a Promise that resolves to a string using the provided parameters.
 *
 * @param {OmgMidjourneyCreateParam} params - Parameters for the API call.
 * @return {Promise<MidjourneySubmitData>} A Promise, representing the API's response.
 * 
 */
export async function simpleCreateMidjourneyImage(params: OmgMidjourneyCreateParam) {
    const { key, prompt, mirrorType, generateType = 'NORMAL', progresser } = params
    if (!key) {
        return { error: 'APIKEY Not Found' };
    }
    const omgMjServ = new OmgMidjourneyService(
        key,
        mirrorType,
        generateType
    )
    try {
        // Request completion from ChatGPT
        const imgResult = await omgMjServ.submitTaskAndGetResult(prompt, progresser);
        return imgResult as OmgMidjourneySubmitData
    } catch (error: any) {
        return { error: 'Caliing Error', message: error.message }
    }
}

/**
 * ### OMG Midjourney Operation Invocation
 * Calls the OMG's Midjourney service based on the given image source address, prompt, and appKey
 * - @see https://aigptx.top to apply for appKey
 * 
 * And returns a Promise that resolves to a string using the provided parameters.
 *
 * @param {OmgMidjourneyOperateParam} params - Parameters for the API call.
 * @return {Promise<MidjourneySubmitData>} A Promise, representing the API's response.
 * 
 */
export async function operateMidjourneyImage(params: OmgMidjourneyOperateParam) {
    const { key, actionId, taskId, mirrorType, generateType = 'NORMAL', progresser } = params
    if (!key) {
        return { error: 'APIKEY Not Found' };
    }
    const omgMjServ = new OmgMidjourneyService(
        key,
        mirrorType,
        generateType
    )
    try {
        // Request completion from ChatGPT
        const imgResult = await omgMjServ.refineImageAndGetResult(taskId, actionId, progresser);
        return imgResult as OmgMidjourneySubmitData
    } catch (error: any) {
        return { error: 'Caliing Error', message: error.message }
    }
}