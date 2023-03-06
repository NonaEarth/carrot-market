import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useSWR from "swr";

interface LoginCheckProps {
	allowedPath?: string[];
}

export default function LoginCheck({ allowedPath }: LoginCheckProps) {
	const { data, error } = useSWR("/api/users/me");
	const router = useRouter();
	const { pathname } = router;

	useEffect(() => {
		if (!allowedPath?.includes(pathname)) {
			if (data && !data.ok) {
				router.replace("/enter");
			}
		}
	}, [data, router, allowedPath, pathname]);

	return <></>;
}
