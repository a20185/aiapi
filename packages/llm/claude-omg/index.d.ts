interface OmgClaudeSimpleCallParam {
    mirrorType?: string;
    content: string;
    key?: string;
}
interface OmgClaudeTemplateUrlCallParam extends OmgClaudeSimpleCallParam {
    url: string;
}
interface OmgClaudeTemplateContentCallParam extends OmgClaudeSimpleCallParam {
    tpl: string;
}
type OmgClaudeTemplateCallParam = OmgClaudeTemplateUrlCallParam | OmgClaudeTemplateContentCallParam;
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
declare function simpleCallOmgClaude(params: Record<string, string>): Promise<{
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
declare function callOmgClaude(params: OmgClaudeTemplateCallParam): Promise<{
    answer: string;
    error?: undefined;
    message?: undefined;
} | {
    error: string;
    message: any;
    answer?: undefined;
} | {
    error: any;
}>;

export { callOmgClaude, simpleCallOmgClaude };
