import useSWR from "swr";

import ProductList from "@/components/product-list";
import Item from "@components/item";
import Layout from "@components/layout";
import { Product } from "@prisma/client";

import { ProductWithCount } from "../";

import type { NextPage } from "next";
interface Record {
	id: number;
	product: ProductWithCount;
}

interface ProductListResponse {
	[key: string]: Record[];
}

const Sold: NextPage = () => {
	const { data } = useSWR<ProductListResponse>(`/api/users/me/sales`);
	return (
		<Layout title="판매내역" canGoBack>
			<div className="flex flex-col space-y-5 pb-10  divide-y">
				<ProductList kind="sales" />
			</div>
		</Layout>
	);
};

export default Sold;
