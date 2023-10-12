
interface ChatGPTNextTemplate {
    templateType: 'chatgptnext'
    avatar: string
    context: {
        role: string
        content: string
        date: string
    }[]
    modelConfig: {
        model: string
        temperature: number
        max_tokens: number
        presence_penalty: number
        sendMemory: boolean
        historyMessageCount: number
        compressMessageLengthThreshold: number
    }
    lang: string
    builtin: boolean
    id: number
}

interface PromptKnitTemplate {
    templateType: 'knit'
    id: string // Prompt  ID
    type: string // Prompt 类型
    name: string // Prompt 名称
    data: {
        topP: number // topP 参数
        model: string // 模型名称
        provider: string // 模型提供商
        maxTokens: number // 最大 token 数量
        temperature: number // temperature 参数
        functionMode: string // Prompt 模式
        systemPrompt: string // 系统提示信息
        frequencyPenalty: number // 频率惩罚参数
    }
    createdAt: string // 创建时间
    updatedAt: string // 更新时间
    projectId: string // 项目 ID
    ownerId: string // 所有者 ID
}

interface DifyTemplate {
    templateType: 'dify'
    id: string // Prompt  ID
    name: string // Prompt 名称
    mode: string // Prompt 模式
    icon: string
    icon_background: string
    enable_site: boolean
    enable_api: boolean
    is_demo: boolean
    model_config: {
        model: {
            provider: string
            name: string
            completion_params: {
                max_tokens: number
                context_max_tokens: number
                temperature: number
                top_p: number
                presence_penalty: number
                frequency_penalty: number
            }
        }
        pre_prompt: string
    }
    created_at: number
}

export type InputPromptTemplate = ChatGPTNextTemplate | PromptKnitTemplate | DifyTemplate

export interface StandardPromptTemplate {
    modelConfig: {
        modelName: string
        params: {
            maxTokens: number
            temperature: number
            topP?: number
            presencePenalty?: number
            frequencyPenalty?: number
        }
    }
    templatePresets: {
        role: string
        content: string
    }[]
    // Additional messages (fewShot 信息)
    fewShotMessages?: {
        role: string
        content: string
    }[]
    // Additional context (函数列表 信息)
    functions?: {
        name: string
        description: string,
        parameters: {
            type: string,
            properties: Record<string, { type: string, description: string }>
            required: string[]
        }
    }[]
    // Additional context (返回格式 信息)
    returnFormat?: Record<string, string>
    // Additional context (插件 信息，暂时只支持 webSearch)
    plugins?: ('web_search')[]
}


function translateChatGptNextToStandardTemplate(input: ChatGPTNextTemplate): StandardPromptTemplate {
    return {
        ...input,
        modelConfig: {
            modelName: input.modelConfig.model,
            params: {
                maxTokens: input.modelConfig.max_tokens,
                temperature: input.modelConfig.temperature,
                presencePenalty: input.modelConfig.presence_penalty
            }
        },
        templatePresets: input.context.map(({ role, content }) => ({ role, content }))
    }
}

function translateDifyToStandardTemplate(input: DifyTemplate): StandardPromptTemplate {
    return {
        ...input,
        modelConfig: {
            modelName: input.model_config.model.name,
            params: {
                maxTokens: input.model_config.model.completion_params.max_tokens,
                temperature: input.model_config.model.completion_params.temperature,
                topP: input.model_config.model.completion_params.top_p,
                presencePenalty: input.model_config.model.completion_params.presence_penalty,
                frequencyPenalty: input.model_config.model.completion_params.frequency_penalty
            }
        },
        templatePresets: [{ role: 'system', content: input.model_config.pre_prompt }]
    }
}

function translatePromptKnitToStandardTemplate(input: PromptKnitTemplate): StandardPromptTemplate {
    return {
        ...input,
        modelConfig: {
            modelName: input.data.model,
            params: {
                maxTokens: input.data.maxTokens,
                temperature: input.data.temperature,
                topP: input.data.topP,
                frequencyPenalty: input.data.frequencyPenalty
            }
        },
        templatePresets: [{ role: 'system', content: input.data.systemPrompt }]
    }
}

export function translateToStandardTemplate(input: InputPromptTemplate): StandardPromptTemplate | null {
    switch (input.templateType) {
        case 'chatgptnext':
            return translateChatGptNextToStandardTemplate(input)
        case 'knit':
            return translatePromptKnitToStandardTemplate(input)
        case 'dify':
            return translateDifyToStandardTemplate(input)
        default:
            return input
    }
}