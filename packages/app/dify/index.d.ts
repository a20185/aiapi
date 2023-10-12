interface DifyCompletionCallParamsExp {
    query: string;
    bearerKey: string;
    inputs?: Record<string, string>;
    user?: string;
    response_mode?: 'streaming' | 'blocking';
    conversationId?: string;
}
interface DifyAppApiConfig {
    customHost?: string;
}

/**
 * ### Dify Custom Configuration
 * Setup dify-compatible service with custom host settings
 *
 * @param {DifyAppApiConfig} conf - Configuration parameters
 * @return {void}
 *
 */
declare function setupDifyApi(conf: DifyAppApiConfig): void;

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
declare function difyCompletion(params: DifyCompletionCallParamsExp): Promise<string>;

export { difyCompletion, setupDifyApi };
