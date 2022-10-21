# openai-api-streaming-completions

This package provides streamable completions from the OpenAI API. Requires a native fetch implementation like what's available in the browser or in node starting with version 17.5.

```
import { streamCompletions } from "openai-api-streaming-completions";

(async () => {
	const data = await streamCompletions({
		prompt: "A long time ago, in a galaxy far away,",
		api_key: "put your api key here",
		onData: (d) => {
			console.log("onData:", d);
		},
	});
	console.log("completed: ", data);
})();
```
