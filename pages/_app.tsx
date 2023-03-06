import "../styles/globals.css";

import { SWRConfig } from "swr";

import LoginCheck from "@/components/loginCheck";

import type { AppProps } from "next/app";
function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<SWRConfig
				value={{
					fetcher: (url: string) =>
						fetch(url).then((response) => response.json()),
				}}
			>
				<LoginCheck allowedPath={["/enter"]} />
				<div className="w-full max-w-xl mx-auto">
					<Component {...pageProps} />
				</div>
			</SWRConfig>
		</>
	);
}

export default MyApp;
