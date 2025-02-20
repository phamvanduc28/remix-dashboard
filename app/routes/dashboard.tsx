import React from "react"; 
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import fs from "fs-extra";
import CustomerTable from "~/components/CustomerTable";
import ProductChart from "~/components/ProductChart";

// Định nghĩa kiểu dữ liệu
interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

interface Order {
  order_id: string;
  customer_id: string;
  total_price: number;
  items: OrderItem[];
  order_date: string;
  status: string;
}

interface Customer {
  customer_id: string;
  total_spent: number;
}

interface Product {
  product_id: string;
  total_sold: number;
}

// Hàm đọc dữ liệu từ file JSON
const getOrdersData = async (): Promise<{ topCustomers: Customer[]; topProducts: Product[] }> => {
  const filePath = "./app/data/orders.json";
  if (!fs.existsSync(filePath)) {
    throw new Error("orders.json not found!");
  }

  const orders: Order[] = await fs.readJson(filePath);
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

  const customerSpending = new Map<string, number>();
  orders.forEach((order) => {
    const orderDate = new Date(order.order_date);
    if (orderDate >= lastMonth) {
      customerSpending.set(
        order.customer_id,
        (customerSpending.get(order.customer_id) || 0) + order.total_price
      );
    }
  });

  const topCustomers: Customer[] = Array.from(customerSpending.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([customer_id, total_spent]) => ({ customer_id, total_spent }));

  const productSales = new Map<string, number>();
  orders.forEach((order) => {
    const orderDate = new Date(order.order_date);
    if (orderDate >= threeMonthsAgo) {
      order.items.forEach((item) => {
        productSales.set(item.product_id, (productSales.get(item.product_id) || 0) + item.quantity);
      });
    }
  });

  const topProducts: Product[] = Array.from(productSales.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([product_id, total_sold]) => ({ product_id, total_sold }));

  return { topCustomers, topProducts };
};

// Loader trong Remix
export const loader = async () => {
  const data = await getOrdersData();
  return json(data);
};

export default function Dashboard() {
  const { topCustomers, topProducts } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof loader>();

  React.useEffect(() => {
    const interval = setInterval(() => {
      fetcher.load("/dashboard");
    }, 10000);
    return () => clearInterval(interval);
  }, [fetcher]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <CustomerTable customers={topCustomers} />
      <ProductChart products={fetcher.data ? fetcher.data.topProducts : topProducts} />
    </div>
  );
}
