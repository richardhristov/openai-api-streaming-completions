export declare const streamCompletions: ({ prompt, engine, max_tokens, temperature, top_p, n, api_key, onData, }: {
    prompt: string;
    engine?: "text-davinci-002" | "text-curie-001" | "text-babbage-001" | "text-ada-001" | undefined;
    max_tokens?: number | undefined;
    temperature?: number | undefined;
    top_p?: number | undefined;
    n?: number | undefined;
    api_key: string;
    onData?: ((data: string) => void) | undefined;
}) => Promise<string>;
