import { DifyAppApiConfig } from "./types"

let config: DifyAppApiConfig = {
    customHost: 'api.dify.ai'
}

/**
 * ### Dify Custom Configuration
 * Setup dify-compatible service with custom host settings
 * 
 * @param {DifyAppApiConfig} conf - Configuration parameters
 * @return {void}
 * 
 */
export function setupDifyApi(conf: DifyAppApiConfig) {
    if (conf?.customHost) {
        config.customHost = conf.customHost
    }
}

export function getDifyApiConfig(): DifyAppApiConfig {
    return config
}