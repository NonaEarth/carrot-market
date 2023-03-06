import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { User } from "@prisma/client";

interface ProfileResponse {
	ok: boolean;
	profile: User;
}

export default function useUser() {
	const { data, error } = useSWR<ProfileResponse>("/api/users/me");
	const router = useRouter();

	useEffect(() => {
		if (data && !data.ok) {
			router.replace("/enter");
		}
	}, [data, router]);

	// // const [user, setUser] = useState();

	// // useEffect(() => {
	// // 	fetch("/api/users/me")
	// // 		.then((response) => response.json())
	// // 		.then((data) => {
	// // 			if (!data.ok) {
	// // 				return router.replace("/enter");
	// // 			}

	// // 			setUser(data.profile);
	// // 		});
	// // }, [router]);

	return { user: data?.profile, isLoading: !data && !error };
}
