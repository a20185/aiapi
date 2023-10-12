export interface DifyCompletionCallParamsExp {
    query: string
    bearerKey: string
    inputs?: Record<string, string>
    user?: string
    response_mode?: 'streaming' | 'blocking'
    conversationId?: string
}

export interface DifyAppApiConfig {
    // Custom host (self-hosted services)
    customHost?: string
}