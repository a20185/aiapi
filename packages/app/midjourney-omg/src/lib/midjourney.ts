/* eslint-disable max-lines */
import https, { RequestOptions } from 'https';

type OmgMidjourneyImageMode = 'ZOOM' | 'IMAGINE' | 'UPSCALE' | 'VARIATION' | 'PAN'
type AnyFunction = (...p: any[]) => any
interface OmgMidjourneyCreateResponse {
    /* 响应的状态码 */
    statusCode: number;
    /* 响应的消息 */
    message: string;
    /* 数据结果：任务ID */
    data: string
}
export interface OmgMidjourneySubmitData {
    /* 响应的状态码 */
    statusCode: number;
    /* 响应的消息 */
    message: string;
    /* 数据对象 */
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


export class OmgMidjourneyService {

    private _token: string;

    private _mjType: 'FAST' | 'NORMAL';

    private _urlAlternative: string

    private readonly _apiUrl = 'aigptx.top';

    private readonly _mirrorA = 'x.dogenet.win';

    private readonly _mirrorB = 'textai.buzz';

    /** CloudFlare 直连 */
    private readonly _mirrorCf1 = 'cn2us02.opapi.win';

    /** CloudFlare Worker反代 */
    private readonly _mirrorCf2 = 'cfwus02.opapi.win';

    /** CloudFlare CDN反代 */
    private readonly _mirrorCf3 = 'cfcus02.opapi.win';

    private readonly _model = 'midjourney';

    private readonly _basePath = '/api/v1/ai/draw/mj';

    protected _createUpsampleAction(uuid: string, sampleRatio: 1 | 2 | 3 | 4) {
        return {
            action: `MJ::JOB::upsample::${sampleRatio}::${uuid}`,
            value: `MJ::JOB::upsample::${sampleRatio}::${uuid}`,
            type: `upsample_u${sampleRatio}`,
            label: `上采样第 ${sampleRatio} 张`
        }
    }

    protected _createTransfomationAction(uuid: string, transformType: 1 | 2 | 3 | 4) {
        return {
            action: `MJ::JOB::variation::${transformType}::${uuid}`,
            value: `MJ::JOB::variation::${transformType}::${uuid}`,
            type: `transform_v${transformType}`,
            label: `重绘第 ${transformType} 张`
        }
    }

    protected _createZoomAction(uuid: string, zoomRatio: 1.5 | 2) {
        const actualValue = zoomRatio === 1.5 ? '75' : '50'
        return {
            action: `MJ::Outpaint::${actualValue}::${uuid}::SOLO`,
            value: `MJ::Outpaint::${actualValue}::${uuid}::SOLO`,
            type: `zoom_out_${actualValue}x`,
            label: `缩小 ${zoomRatio} 倍`
        }
    }

    protected _createRemakeAction(uuid: string) {
        const customId = `MJ::JOB::reroll::0::${uuid}::SOLO`
        return {
            action: customId,
            value: customId,
            type: 'remake',
            label: '重新生成'
        }
    }

    protected _createSquareAction(uuid: string) {
        const customId = `MJ::Outpaint::100::1::${uuid}::SOLO`
        return {
            action: customId,
            value: customId,
            type: 'make_square',
            label: '裁剪为 1:1'
        }
    }

    protected _createPaddingAction(uuid: string, typerMode: 'left' | 'right' | 'up' | 'down') {
        const varItem = { variation: '', variationText: '', customId: '' }
        switch (typerMode) {
            case 'left':
                varItem.variation = 'left_pan_variation'
                varItem.variationText = '左边对齐重绘'
                varItem.customId = `MJ::JOB::${varItem.variation}::1::${uuid}::SOLO`
                break
            case 'right':
                varItem.variation = 'right_pan_variation'
                varItem.variationText = '右边对齐重绘'
                varItem.customId = `MJ::JOB::${varItem.variation}::1::${uuid}::SOLO`
                break
            case 'up':
                varItem.variation = 'up_pan_variation'
                varItem.variationText = '上边对齐重绘'
                varItem.customId = `MJ::JOB::${varItem.variation}::1::${uuid}::SOLO`
                break
            case 'down':
                varItem.variation = 'down_pan_variation'
                varItem.variationText = '下边对齐重绘'
                varItem.customId = `MJ::JOB::${varItem.variation}::1::${uuid}::SOLO`
                break
            default:
                break
        }
        return {
            action: varItem.customId,
            value: varItem.customId,
            type: varItem.variation,
            label: varItem.variationText
        }
    }

    protected _createVariationAction(uuid: string, typerMode: 'high' | 'low' | 'region') {
        const varItem = { variation: '', variationText: '', customId: '' }
        switch (typerMode) {
            case 'high':
                varItem.variation = 'high_variation'
                varItem.variationText = '高质量重绘'
                varItem.customId = `MJ::JOB::${varItem.variation}::1::${uuid}::SOLO`
                break
            case 'low':
                varItem.variation = 'low_variation'
                varItem.variationText = '低质量重绘'
                varItem.customId = `MJ::JOB::${varItem.variation}::1::${uuid}::SOLO`
                break
            case 'region':
                varItem.variation = 'region_variation'
                varItem.variationText = '局部重绘'
                varItem.customId = `MJ::Inpaint::1::${uuid}::SOLO`
                break
            default:
                break
        }
        return {
            action: varItem.customId,
            value: varItem.customId,
            type: varItem.variation,
            label: varItem.variationText
        }
    }

    protected _mapMJActions(typerMode: OmgMidjourneyImageMode, actions: { customId: string }[]) {
        const tgt = (actions[0]?.customId ?? '').split('::')
        const actionId_1 = tgt.pop() ?? ''
        const actionId_2 = tgt.pop() ?? ''

        const actionId = actionId_1 === 'SOLO' ? actionId_2 : actionId_1
        const upsampleActions = [
            this._createUpsampleAction(actionId, 1),
            this._createUpsampleAction(actionId, 2),
            this._createUpsampleAction(actionId, 3),
            this._createUpsampleAction(actionId, 4),
        ]
        const panSideActions = [
            this._createPaddingAction(actionId, 'left'),
            this._createPaddingAction(actionId, 'right'),
            this._createPaddingAction(actionId, 'up'),
            this._createPaddingAction(actionId, 'down'),
        ]
        const zoomOutActions = [
            this._createZoomAction(actionId, 1.5),
            this._createZoomAction(actionId, 2),
        ]
        const transformActions = [
            this._createTransfomationAction(actionId, 1),
            this._createTransfomationAction(actionId, 2),
            this._createTransfomationAction(actionId, 3),
            this._createTransfomationAction(actionId, 4),
        ]
        const variationActions = [
            this._createVariationAction(actionId, 'high'),
            this._createVariationAction(actionId, 'low'),
            this._createVariationAction(actionId, 'region'),
        ]
        const defaultActions = [this._createRemakeAction(actionId)]
        switch (typerMode) {
            case 'UPSCALE':
                return [
                    ...variationActions,
                    ...zoomOutActions,
                    ...panSideActions,
                    this._createSquareAction(actionId)
                ]
            case 'PAN':
                return [...upsampleActions, ...defaultActions]
            case 'VARIATION':
            case 'ZOOM':
            case 'IMAGINE':
            default:
                return [
                    ...upsampleActions,
                    ...transformActions,
                    ...defaultActions
                ]
        }
    }

    protected _mapMjCdnPath(originPath: string) {
        return {
            /** 知数云加速地址 */
            cdnUrl: originPath.replace(
                'https://cdn.discordapp.com/',
                'https://midjourney.cdn.zhishuyun.com/'
            ),
            /** wsrv proxy Url */
            proxyUrl: `https://wsrv.nl/?url=${encodeURIComponent(originPath)}`
        }
    }

    /**
     * 创建 OmgMidjourney 任务
     * @param {string} prompt - Prompt提示词
     * @param {string[]} [base64Array] - 垫图的Base64数组，作为AI生成图片时的参考图片
     * @param {string} [webhook] - Mj图片生成回调地址
     * @returns {Promise<any>} - 返回 API 响应数据的 Promise 对象
     */
    public createTask(prompt: string, base64Array?: string[], webhook?: string): Promise<OmgMidjourneyCreateResponse> {
        const options: RequestOptions = {
            hostname: this._selectMirror(),
            path: `${this._basePath}/imagine`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${this._token}`
            }
        };
        const data = new URLSearchParams()
        data.append('model', this._model)
        data.append('type', this._mjType)
        data.append('prompt', prompt)
        if (webhook) data.append('webhook', webhook)
        if (base64Array) data.append('base64Array', base64Array?.join(','))

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let responseBody = '';
                res.setEncoding('utf8'); // 设置响应流编码为 utf8
                res.on('data', (chunk) => {
                    responseBody += chunk;
                });
                res.on('end', () => {
                    resolve(JSON.parse(responseBody));
                });
            });
            req.on('error', (error) => {
                reject(error);
            });
            req.write(data.toString());
            req.end();
        });
    }

    /**
     * OmgMidjourney 图片操作
     * @param {string} prompt - Prompt提示词
     * @param {string[]} [base64Mask] - 垫图的Base64遮罩，用于处理局部重绘
     * @param {string} [webhook] - Mj图片生成回调地址
     * @returns {Promise<any>} - 返回 API 响应数据的 Promise 对象
     */
    public createRepaintTransformation(taskId: string, actionId: string, base64Mask?: string, webhook?: string): Promise<OmgMidjourneyCreateResponse> {
        const options: RequestOptions = {
            hostname: this._selectMirror(),
            path: `${this._basePath}/action`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${this._token}`
            }
        };
        const data = new URLSearchParams()
        data.append('model', this._model)
        data.append('type', this._mjType)
        data.append('customId', actionId)
        data.append('taskId', taskId)
        if (webhook) data.append('webhook', webhook)
        if (base64Mask) data.append('base64Mask', base64Mask)

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let responseBody = '';
                res.setEncoding('utf8'); // 设置响应流编码为 utf8
                res.on('data', (chunk) => {
                    responseBody += chunk;
                });
                res.on('end', () => {
                    resolve(JSON.parse(responseBody));
                });
            });
            req.on('error', (error) => {
                reject(error);
            });
            req.write(data.toString());
            req.end();
        });
    }

    /**
     * 查询 OmgMidjourney 任务执行状态
     * @param {string} token - 授权令牌
     * @param {string} taskId - 任务ID
     * @returns {Promise<any>} - 返回 API 响应数据的 Promise 对象
     */
    public queryTask(taskId: string): Promise<OmgMidjourneySubmitData> {
        const options: RequestOptions = {
            hostname: this._selectMirror(),
            path: `${this._basePath}/query`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${this._token}`
            },
        };
        const data = new URLSearchParams({ model: this._model, taskId: taskId.toString() }).toString();
        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let responseBody = '';
                res.setEncoding('utf8'); // 设置响应流编码为 utf8
                res.on('data', (chunk) => {
                    responseBody += chunk;
                });
                res.on('end', () => {
                    const resp = JSON.parse(responseBody) as OmgMidjourneySubmitData
                    const patchedLinks = this._mapMjCdnPath(resp.data.imageDcUrl || '')
                    resp.data.imageDcUrl = patchedLinks.cdnUrl
                    Object.assign(resp.data, patchedLinks)
                    resp.data.actions = this._mapMJActions(resp.data.action, resp.data.actions || []) as any
                    resolve(resp);
                });
            });
            req.on('error', (error) => {
                reject(error);
            });
            req.write(data);
            req.end();
        });
    }

     /**
     * 提交 OmgMidjourney 图片优化任务并获取结果
     * @param {string} actionId - 图片操作语句
     * @param {string[]} [base64Array] - 垫图的Base64数组，作为AI生成图片时的参考图片
     * @param {string} [webhook] - Mj图片生成回调地址
     * @returns {Promise<any>} - 返回任务结果的 Promise 对象
     */
     public refineImageAndGetResult(taskId: string, prompt: string, prog: AnyFunction = () => {}, base64Mask?: string, webhook?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // 创建任务
            this.createRepaintTransformation(taskId, prompt, base64Mask, webhook)
                .then((response) => {
                    const taskId = response.data;
                    // 轮询查询任务结果
                    const intervalId = setInterval(() => {
                        this.queryTask(taskId)
                            .then((response) => {
                                const status = response.data.status;
                                prog(response.data.progress);
                                if (status === 'SUCCESS') {
                                    clearInterval(intervalId);
                                    resolve(response);
                                } else if (status === 'FAILED') {
                                    clearInterval(intervalId);
                                    reject(new Error('Task failed'));
                                }
                            })
                            .catch((error) => {
                                clearInterval(intervalId);
                                reject(error);
                            });
                    }, 2000); // 每隔5秒查询一次任务结果
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * 提交 OmgMidjourney 任务并获取结果
     * @param {string} token - 授权令牌
     * @param {string} prompt - Prompt提示词
     * @param {string} [type=FAST] - Mj绘图资源池类型，可选值为NORMAL和FAST，默认为FAST
     * @param {string[]} [base64Array] - 垫图的Base64数组，作为AI生成图片时的参考图片
     * @param {string} [webhook] - Mj图片生成回调地址
     * @returns {Promise<any>} - 返回任务结果的 Promise 对象
     */
    public submitTaskAndGetResult(prompt: string, prog: AnyFunction = () => {}, base64Array?: string[], webhook?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // 创建任务
            this.createTask(prompt, base64Array, webhook)
                .then((response) => {
                    const taskId = response.data;
                    // 轮询查询任务结果
                    const intervalId = setInterval(() => {
                        this.queryTask(taskId)
                            .then((response) => {
                                const status = response.data.status;
                                prog(response.data.progress);
                                if (status === 'SUCCESS') {
                                    clearInterval(intervalId);
                                    resolve(response);
                                } else if (status === 'FAILED') {
                                    clearInterval(intervalId);
                                    reject(new Error('Task failed'));
                                }
                            })
                            .catch((error) => {
                                clearInterval(intervalId);
                                reject(error);
                            });
                    }, 2000); // 每隔5秒查询一次任务结果
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    private _selectMirror() {
        switch (this._urlAlternative) {
            case 'base':
                return this._apiUrl
            case 'mirror_1':
                return this._mirrorA
            case 'mirror_2':
                return this._mirrorB
            case 'mirror_cf1':
                return this._mirrorCf1
            case 'mirror_cf2':
                return this._mirrorCf2
            case 'mirror_cf3':
                return this._mirrorCf3
            default:
                return this._apiUrl
        }
    }

    /**
     * Constructs a new instance of the OmgMidjourneyService.
     *
     * @param {string} token - 授权令牌
     * @param {string} [_u='base'] - 镜像地址选择
     * @param {'FAST' | 'NORMAL'} [type=FAST] - Mj绘图资源池类型，可选值为 NORMAL 和 FAST，默认为 NORMAL
     */
    public constructor(token: string, _u = 'base', _t: 'FAST' | 'NORMAL' = 'NORMAL') {
        this._token = token;
        this._urlAlternative = _u
        this._mjType = _t
    }
}
