import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";

import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import { cls } from "@/libs/client/utils";
import Button from "@components/button";
import Layout from "@components/layout";
import { Product, User } from "@prisma/client";

interface ProductWithUser extends Product {
	user: User;
}
interface ItemDetailResponse {
	ok: boolean;
	product: ProductWithUser;
	relatedProducts: Product[];
	isLiked: boolean;
}

const ItemDetail: NextPage = () => {
	const { user, isLoading } = useUser();
	const router = useRouter();
	const { mutate: unboundMutate } = useSWRConfig();
	const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
		router.query.id ? `/api/products/${router.query.id}` : null
	);

	// const { data, mutate } = useSWR<any>(
	// 	router.query.id ? `/api/products/${router.query.id}` : null
	// );

	const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
	const onFavClick = () => {
		if (!data) return;
		boundMutate(
			(prev) =>
				prev && {
					...prev,
					isLiked: !prev.isLiked,
				},
			false
		);
		// unboundMutate(
		// 	"/api/users/me",
		// 	(prev: any) => {
		// 		return { ok: !prev.ok };
		// 	},
		// 	false
		// );
		toggleFav({});
	};

	return (
		<Layout canGoBack>
			<div className="px-4  py-4">
				<div className="h-10">
					<div className="h-96 relative">
						<Image
							src={`https://imagedelivery.net/dUSxCjNIvhJnkYZptPlrWA/${data?.product.image}/public`}
							className="bg-slate-300 object-cover"
							alt="product name"
							fill
						/>
					</div>

					<div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
						<Image
							src={`https://imagedelivery.net/dUSxCjNIvhJnkYZptPlrWA/${data?.product.user.avatar}/avatar`}
							className="w-12 h-12 rounded-full bg-slate-300"
							alt="profile picture"
							width={48}
							height={48}
						/>
						<div>
							<p className="text-sm font-medium text-gray-700">
								{data?.product?.user?.name}
							</p>
							<Link
								href={`/users/profiles/${data?.product?.user?.name}`}
								className="text-xs font-medium text-gray-500"
							>
								View profile &rarr;
							</Link>
						</div>
					</div>
					<div className="mt-5">
						<h1 className="text-3xl font-bold text-gray-900">
							{data?.product?.name}
						</h1>
						<span className="text-2xl block mt-3 text-gray-900">
							${data?.product?.price}
						</span>
						<p className=" my-6 text-gray-700">{data?.product?.description}</p>
						<div className="flex items-center justify-between space-x-2">
							<Button large text="Talk to seller" />
							<button
								onClick={onFavClick}
								className={cls(
									"p-3 rounded-md flex items-center hover:bg-gray-100 justify-center",
									data?.isLiked
										? "text-red-500  hover:text-red-600"
										: "text-gray-400  hover:text-gray-500"
								)}
								// className="p-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
							>
								{data?.isLiked ? (
									<svg
										className="w-6 h-6 "
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										viewBox="0 0 20 20"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
											clipRule="evenodd"
										/>
									</svg>
								) : (
									<svg
										className="h-6 w-6 "
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
										/>
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>
				<div>
					<h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
					<div className=" mt-6 grid grid-cols-2 gap-4">
						{data?.relatedProducts.map((product) => (
							<Link key={product.id} href={`/products/${product.id}`}>
								<div>
									<div className="h-56 w-full mb-4 bg-slate-300" />
									<h3 className="text-gray-700 -mb-1">{product.name}</h3>
									<span className="text-sm font-medium text-gray-900">
										{product.price}
									</span>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default ItemDetail;
