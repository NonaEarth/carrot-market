import mail from "@sendgrid/mail";

import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";

mail.setApiKey(process.env.SENDGRID_KEY!);

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
	// // if (email) {
	// // 	user = await client.user.findUnique({
	// // 		where: {
	// // 			email,
	// // 		},
	// // 	});
	// // 	if (user) {
	// // 		console.log("Found it!");
	// // 	}

	// // 	if (!user) {
	// // 		console.log("User Not Found. Creating One...");
	// // 		user = await client.user.create({
	// // 			data: {
	// // 				name: "Anonymous",
	// // 				email,
	// // 			},
	// // 		});
	// // 	}

	// // 	console.log(user);
	// // }

	// // if (phone) {
	// // 	user = await client.user.findUnique({
	// // 		where: {
	// // 			phone: +phone,
	// // 		},
	// // 	});
	// // 	if (user) {
	// // 		console.log("Found it!");
	// // 	}

	// // 	if (!user) {
	// // 		console.log("User Not Found. Creating One...");
	// // 		user = await client.user.create({
	// // 			data: {
	// // 				name: "Anonymous",
	// // 				phone: +phone,
	// // 			},
	// // 		});
	// // 	}

	// // 	console.log(user);
	// // }

	const { phone, email } = req.body;
	const user = phone ? { phone: phone } : email ? { email } : null;

	if (!user) return res.status(400).json({ ok: false });
	const payload = Math.floor(100000 + Math.random() * 900000) + "";
	const token = await client.token.create({
		data: {
			payload,
			user: {
				connectOrCreate: {
					where: {
						...user,
					},
					create: {
						name: "Anonymous",
						...user,
					},
				},
			},
		},
	});

	// if (phone) {
	// 	const message = await twilioClient.messages.create({
	// 		messagingServiceSid: process.env.TWILIO_MSID,
	// 		to: process.env.MY_PHONE!,
	// 		body: `Your login token is ${payload}`,
	// 	});
	// 	console.log(message);
	// } else if (email) {
	// 	const email = await mail.send({
	// 		from: "hjn6312@gmail.com",
	// 		to: "hjn6312@gmail.com",
	// 		subject: "Your Carrot Market Verification Email",
	// 		text: `Your token is ${payload}`,
	// 		html: `<strong>Your token is ${payload}</strong>`
	// 	});
	// 	console.log(email);
	// }

	return res.json({
		ok: true,
	});
}

export default withHandler({
	methods: ["POST"],
	handler,
	isPrivate: false,
});
