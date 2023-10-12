type KeySelectionType<T> = T[keyof T];
declare const MinimaxBaseModelType: {
    readonly ABAB_V5Pro: "abab5.5-chat";
    readonly ABAB_V5: "abab5-chat";
};
declare const MinimaxSensitiveWordType: {
    readonly SEVERE_VIOLATION: 1;
    readonly PORNOGRAPHY: 2;
    readonly ADVERTISEMENT: 3;
    readonly PROHIBITION: 4;
    readonly INSULT: 5;
    readonly TERRORISM: 6;
    readonly OTHERS: 7;
};
interface MinimaxChatCompletionResponse {
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
interface MinimaxChatCompletionChoice {
    text: string;
    index: number;
    finish_reason: string;
    delta?: string;
}

interface MinimaxSimpleCallParam {
    model?: string;
    content: string;
    key: string;
    groupId: string;
}
interface MinimaxTemplateUrlCallParam extends Omit<MinimaxSimpleCallParam, 'model'> {
    url: string;
}
interface MinimaxTemplateContentCallParam extends Omit<MinimaxSimpleCallParam, 'model'> {
    tpl: string;
}
type MinimaxTemplateCallParam = MinimaxTemplateUrlCallParam | MinimaxTemplateContentCallParam;
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
declare function simpleCallMinimax(params: MinimaxSimpleCallParam): Promise<{
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
declare function simpleCallMinimaxPro(params: MinimaxSimpleCallParam): Promise<{
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
declare function callMinimax(params: MinimaxTemplateCallParam): Promise<MinimaxChatCompletionResponse | {
    error: any;
}>;
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
declare function callMinimaxPro(params: MinimaxTemplateCallParam): Promise<MinimaxChatCompletionResponse | {
    error: any;
}>;

export { MinimaxSimpleCallParam, callMinimax, callMinimaxPro, simpleCallMinimax, simpleCallMinimaxPro };
