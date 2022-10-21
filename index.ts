import fetch from "node-fetch";
import { URLSearchParams } from "url";
import { TextDecoder } from "util";

export const streamCompletions = async ({
	prompt,
	engine = "text-davinci-002",
	max_tokens = 256,
	temperature = 0.7,
	top_p = 1,
	n = 1,
	api_key,
	onData = () => null,
}: {
	prompt: string;
	engine?:
		| "text-davinci-002"
		| "text-curie-001"
		| "text-babbage-001"
		| "text-ada-001";
	max_tokens?: number;
	temperature?: number;
	top_p?: number;
	n?: number;
	api_key: string;
	onData?: (data: string) => void;
}) => {
	const response = await fetch(
		`https://api.openai.com/v1/engines/${engine}/completions/browser_stream?` +
			new URLSearchParams({
				prompt,
				max_tokens: max_tokens.toString(),
				temperature: temperature.toString(),
				top_p: top_p.toString(),
				n: n.toString(),
			}),
		{
			headers: {
				Authorization: "Bearer " + api_key,
			},
		}
	);
	if (!response.ok || !response.body) {
		throw new Error("Response is not ok!");
	}

	let data = "";
	for await (const chunk of response.body) {
		if (!chunk) {
			continue;
		}
		const chunkStr =
			typeof chunk !== "string" ? new TextDecoder().decode(chunk) : chunk;
		// console.log("chunkStr:" + chunkStr);
		if (!chunkStr) {
			continue;
		}
		for (const chunkSplit of chunkStr.split("\n")) {
			if (!chunkSplit) {
				continue;
			}
			if (chunkSplit.match(/^\n?data: \[DONE\]/)?.length) {
				return data;
			}
			const parsed = JSON.parse(chunkSplit.replace(/^\n?data: /, ""));
			onData(parsed.choices[0].text);
			data += parsed.choices[0].text;
		}
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
