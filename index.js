export const streamCompletions = async ({ prompt, engine = "text-davinci-002", max_tokens = 256, temperature = 0.7, top_p = 1, n = 1, api_key, onData = () => null, }) => {
    const response = await fetch(`https://api.openai.com/v1/engines/${engine}/completions/browser_stream?` +
        new URLSearchParams({
            prompt,
            max_tokens: max_tokens.toString(),
            temperature: temperature.toString(),
            top_p: top_p.toString(),
            n: n.toString(),
        }), {
        headers: {
            Authorization: "Bearer " + api_key,
        },
    });
    if (!response.ok || !response.body) {
        throw new Error("Response is not ok!");
    }
    let data = "";
    const reader = response.body.getReader();
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            return data;
        }
        if (!value) {
            continue;
        }
        const chunkStr = new TextDecoder().decode(value);
        // console.log("value:" + chunkStr);
        if (!chunkStr) {
            continue;
        }
        if (chunkStr.match(/^data: \[DONE\]/)?.length) {
            break;
        }
        const parsed = JSON.parse(chunkStr.replace(/^\n?data: /, ""));
        onData(parsed.choices[0].text);
        data += parsed.choices[0].text;
    }
    return data;
};
// (async () => {
// 	const data = await streamCompletions({
// 		prompt: "A long time ago, in a galaxy far away,",
// 		api_key: "",
// 		onData: (d) => {
// 			console.log("onData:", d);
// 		},
// 	});
// 	console.log("completed: ", data);
// })();
