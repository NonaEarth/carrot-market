import { withIronSessionApiRoute } from "iron-session/next";

const cookieOptions = {
	cookieName: "carrotsession",
    password: process.env.COOKIE_PASSWORD!,
};

declare module "iron-session" {
	interface IronSessionData {
		user?: {
			id: number;
		};
	}
}

export function withApiSession(fn: any) {
    return withIronSessionApiRoute(fn, cookieOptions);
}