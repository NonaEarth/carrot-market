import { NextApiRequest, NextApiResponse } from "next";

import { withApiSession } from "@/libs/server/withSession";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	const {
		session: { user },
		body: { name, price, description },
	} = req;

	if (req.method === "POST") {
		const {
			result: {
				uid,
				rtmps: { streamKey, url },
			},
		} = await (
			await fetch(
				`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${process.env.CLOUDFLARE_STREAM_API_TOKEN}`,
					},
					body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic", "timeoutSeconds": 10, "requireSignedURLs": false}}`,
				}
			)
		).json();

		const stream = await client.stream.create({
			data: {
				cloudflareId: uid,
				cloudflareKey: streamKey,
				cloudflareUrl: url,
				name,
				price,
				description,
				user: {
					connect: {
						id: user?.id,
					},
				},
			},
		});

		res.json({ ok: true, stream });
	} else if (req.method === "GET") {
		const streams = await client.stream.findMany({
			// take: 10,
			// skip: 20,
		});

		res.json({ ok: true, streams });
	}
}

export default withApiSession(
	withHandler({
		methods: ["GET", "POST"],
		handler,
	})
);
