const orders: any[] = [];

class OrderRepository {
  create(order: any) {
    const newOrder = {
      id: orders.length + 1,
      ...order,
    };

    orders.push(newOrder);
    return newOrder;
  }

  findAll() {
    return orders;
  }
}

export const orderRepository = new OrderRepository();
