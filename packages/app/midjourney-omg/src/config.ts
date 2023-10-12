import { DifyAppApiConfig } from "./types"

let config: DifyAppApiConfig = {
    customHost: 'api.dify.ai'
}

export function setupDifyApi(conf: DifyAppApiConfig) {
    if (conf?.customHost) {
        config.customHost = conf.customHost
    }
}

export function getDifyApiConfig(): DifyAppApiConfig {
    return config
}