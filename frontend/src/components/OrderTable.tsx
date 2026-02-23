import type { Order } from "../types";

interface Props {
  orders: Order[];
}

export const OrderTable = ({ orders }: Props) => {
  return (
    <table border={1} cellPadding={8}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Subtotal</th>
          <th>Tax</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.subtotal}</td>
            <td>{order.tax_amount}</td>
            <td>{order.total_amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};