interface CallParamsExp {
    query: string;
    bearerKey: string;
    inputs?: Record<string, string>;
    user?: string;
    response_mode?: 'streaming' | 'blocking';
    conversationId?: string;
}
interface CallParamsStable extends CallParamsExp {
    app_id: string;
}
declare function expCallAida(params: CallParamsExp): Promise<string>;
declare function stableCallAida(params: CallParamsStable): Promise<string>;

export { CallParamsExp, CallParamsStable, expCallAida, stableCallAida };
