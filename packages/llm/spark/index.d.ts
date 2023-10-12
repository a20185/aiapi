interface XunfeiSparkSDKChoices {
    status: number;
    seq: number;
    text: {
        content: string;
        role: 'assistant';
        index: number;
    }[];
}
interface XunfeiSparkSDKUsage {
    text: {
        question_tokens: number;
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

interface XunfeiSparkSimpleCallParam {
    model?: string;
    content: string;
    appId: string;
    key?: string;
    secret: string;
    uid?: string;
    host?: string;
}
interface XunfeiSparkTemplateUrlCallParam extends Omit<XunfeiSparkSimpleCallParam, 'model'> {
    url: string;
}
interface XunfeiSparkTemplateContentCallParam extends Omit<XunfeiSparkSimpleCallParam, 'model'> {
    tpl: string;
}
type XunfeiSparkTemplateCallParam = XunfeiSparkTemplateUrlCallParam | XunfeiSparkTemplateContentCallParam;
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
declare function simpleCallXfSpark(params: XunfeiSparkSimpleCallParam): Promise<{
    error: string;
    answer?: undefined;
    message?: undefined;
} | {
    answer: string;
    error?: undefined;
    message?: undefined;
} | {
    error: string;
    message: any;
    answer?: undefined;
}>;
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
declare function callXfSpark(params: XunfeiSparkTemplateCallParam): Promise<{
    choices: XunfeiSparkSDKChoices;
    usage: XunfeiSparkSDKUsage;
} | {
    error: any;
}>;

export { callXfSpark, simpleCallXfSpark };
