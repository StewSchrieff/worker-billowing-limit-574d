export default {
	async fetch(request, env) {
		const apiAccount = env.ACCOUNT_ID;
		const apiToken = env.API_TOKEN;

		const url = new URL(request.url);
		let model = '@cf/bytedance/stable-diffusion-xl-lightning';
		let type = 'image';
		if (url.searchParams.get('m')) {
			switch (url.searchParams.get('m')) {
				case 'dreamshaper':
					model = '@cf/lykon/dreamshaper-8-lcm';
					break;
				case 'sdbase':
					model = '@cf/stabilityai/stable-diffusion-xl-base-1.0';
					break;
				case 'llamaFP':
					model = '@cf/meta/llama-2-7b-chat-fp16';
					type = 'text';
					break;
				case 'llamaInt':
					model = '@cf/meta/llama-2-7b-chat-int8';
					type = 'text';
					break;
				case 'mistral':
					model = '@cf/mistral/mistral-7b-instruct-v0.1';
					type = 'text';
					break;
				case 'falcon':
					model = '@cf/tiiuae/falcon-7b-instruct';
					type = 'text';
					break;
				case 'gemma':
					model = '@hf/google/gemma-7b-it';
					type = 'text';
					break;
				case 'phi':
					model = '@cf/microsoft/phi-2';
					type = 'text';
					break;
				case 'starling':
					model = '@hf/nexusflow/starling-lm-7b-beta';
					type = 'text';
					break;
				case 'zephyr':
					model = '@hf/thebloke/zephyr-7b-beta-awq';
					type = 'text';
					break;
				default:
					// sdlightning
					break;
			}
		}

		if (type == 'image') {
			const inputs = {
				prompt:
					'Generate an image to be used in an advertisement for a ' +
					url.searchParams.get('b') +
					'that incorporates the following pun:' +
					url.searchParams.get('p') +
					'. Be sure to visually include all nouns mentioned in the pun.',
			};
			console.log(url.searchParams.get('p'));
			console.log(model);

			const fetchOptions = {
				method: 'POST',
				body: JSON.stringify(inputs),
				headers: { authorization: `Bearer ${apiToken}`, 'content-type': 'image/png' },
			};
			let response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${apiAccount}/ai/run/${model}`, fetchOptions);

			return new Response(response.body, {
				headers: {
					'content-type': 'image/png',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': '*',
					'Access-Control-Allow-Methods': 'GET, OPTIONS',
					'Access-Control-Max-Age': '86400',
				},
			});
		} else {
			// is text driven
			console.log('is text driven');
			const inputs = {
				messages: [
					{
						role: 'system',
						content:
							'You are a pun generator. You will always respond with three puns useful for an advertisement, numbered 1, 2 and 3. The shorter the pun can be, the better. You will exchange no pleasantries.',
					},
					{ role: 'user', content: url.searchParams.get('p') },
				],
			};
			const fetchOptions = {
				method: 'POST',
				body: JSON.stringify(inputs),
				headers: { authorization: `Bearer ${apiToken}`, 'content-type': 'image/png' },
			};
			let response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${apiAccount}/ai/run/${model}`, fetchOptions);
			return new Response(response.body, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': '*',
					'Access-Control-Allow-Methods': 'GET, OPTIONS',
					'Access-Control-Max-Age': '86400',
				},
			});
		}
	},
};
