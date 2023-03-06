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
	} = req;

	const reviews = await client.review.findMany({
		where: {
			createdforId: user?.id,
		},
		include: {
			createdBy: {
				select: {
					id: true,
					name: true,
					avatar: true,
				},
			},
		},
	});

	res.json({
		ok: true,
		reviews,
	});
	// res.status(200).end();
}

export default withApiSession(
	withHandler({
		methods: ["GET"],
		handler,
	})
);
