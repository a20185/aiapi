type OmgMidjourneyImageMode = 'ZOOM' | 'IMAGINE' | 'UPSCALE' | 'VARIATION' | 'PAN';
interface OmgMidjourneySubmitData {
    statusCode: number;
    message: string;
    data: {
        /** 任务 ID */
        taskId: number;
        /** 任务类型 */
        taskType: string;
        /** 任务状态 */
        status: string;
        /** 任务动作 */
        action: OmgMidjourneyImageMode;
        /** 任务进度 */
        progress: string;
        /** 任务描述 */
        description: string;
        /** Prompt */
        prompt: string;
        /** 失败原因 */
        failReason: null;
        /** 提交时间 */
        submitTime: string;
        /** 开始时间 */
        startTime: string;
        /** 完成时间 */
        finishTime: string;
        /** 回调地址 */
        webhookUrl: string;
        /** Discord 上的图片地址 */
        imageDcUrl: string;
        /** S3 上的图片地址 */
        imageS3Url: null;
        /** 任务的附加可执行动作 */
        actions: {
            /** 动作的自定义 ID */
            customId: string;
            /** 动作的表情符号 */
            emoji: string;
            /** 动作的标签 */
            label: string;
        }[];
    };
}

interface OmgMidjourneyBaseParam {
    mirrorType?: string;
    key?: string;
    generateType?: 'FAST' | 'NORMAL';
    progresser?: (...p: any[]) => any;
}
interface OmgMidjourneyCreateParam extends OmgMidjourneyBaseParam {
    prompt: string;
}
interface OmgMidjourneyOperateParam extends OmgMidjourneyBaseParam {
    actionId: string;
    taskId: string;
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
declare function simpleCreateMidjourneyImage(params: OmgMidjourneyCreateParam): Promise<OmgMidjourneySubmitData | {
    error: string;
    message?: undefined;
} | {
    error: string;
    message: any;
}>;
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
declare function operateMidjourneyImage(params: OmgMidjourneyOperateParam): Promise<OmgMidjourneySubmitData | {
    error: string;
    message?: undefined;
} | {
    error: string;
    message: any;
}>;

export { operateMidjourneyImage, simpleCreateMidjourneyImage };
