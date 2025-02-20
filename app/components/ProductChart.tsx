import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Product {
  product_id: string;
  total_sold: number;
}

interface ProductChartProps {
  products: Product[];
}

export default function ProductChart({ products }: ProductChartProps) {
  return (
    <div className="mt-5">
      <h2 className="text-xl font-semibold">Top 5 Sản Phẩm Bán Chạy</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={products}>
          <XAxis dataKey="product_id" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total_sold" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
