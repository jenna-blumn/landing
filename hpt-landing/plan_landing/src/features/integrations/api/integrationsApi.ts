import { OMSOrder, OrderSearchParams } from '../types';
import { generateOMSOrdersForCustomer } from '../mockData';

export const getOrdersByIntegrationId = async (
  integrationId: string,
  customerName: string,
  params?: OrderSearchParams
): Promise<OMSOrder[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  const allOrders = generateOMSOrdersForCustomer(customerName);

  let filteredOrders = allOrders.filter(
    order => order.oms_integration_id === integrationId
  );

  if (params?.status) {
    filteredOrders = filteredOrders.filter(
      order => order.status === params.status
    );
  }

  if (params?.start_date) {
    filteredOrders = filteredOrders.filter(
      order => new Date(order.order_date) >= new Date(params.start_date!)
    );
  }

  if (params?.end_date) {
    filteredOrders = filteredOrders.filter(
      order => new Date(order.order_date) <= new Date(params.end_date!)
    );
  }

  return filteredOrders.sort((a, b) =>
    new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
  );
};
