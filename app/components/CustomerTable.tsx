import { useState, useMemo } from "react";

// Định nghĩa kiểu dữ liệu của một khách hàng
interface Customer {
  customer_id: string;
  total_spent: number;
}

// Định nghĩa kiểu cho props của bảng
interface CustomerTableProps {
  customers: Customer[];
}

export default function CustomerTable({ customers }: CustomerTableProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // useMemo để tối ưu hóa sorting
  const sortedCustomers = useMemo(() => {
    return [...customers].sort((a, b) =>
      sortOrder === "desc" ? b.total_spent - a.total_spent : a.total_spent - b.total_spent
    );
  }, [customers, sortOrder]);

  return (
    <div className="mt-5">
      <h2 className="text-xl font-semibold">Top 10 Khách Hàng</h2>
      <button 
        onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
        className="p-2 bg-blue-500 text-white rounded">
        Sắp xếp: {sortOrder === "desc" ? "Giảm dần" : "Tăng dần"}
      </button>
      <div className="overflow-auto max-h-96">
        <table className="w-full border-collapse border mt-2">
          <thead>
            <tr>
              <th className="border p-2">Khách Hàng</th>
              <th className="border p-2">Tổng Chi Tiêu</th>
            </tr>
          </thead>
          <tbody>
            {sortedCustomers.map((customer) => (
              <tr key={customer.customer_id}>
                <td className="border p-2">{customer.customer_id}</td>
                <td className="border p-2">${customer.total_spent.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
