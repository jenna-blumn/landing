import React, { useEffect, useState, useCallback } from 'react';
import { Icon, Badge, Button, Card, Collapsible, CollapsibleTrigger, CollapsibleContent, ScrollArea } from '@blumnai-studio/blumnai-design-system';
import { OMSIntegration, OMSOrder } from '../../../features/integrations/types';
import { getOrdersByIntegrationId } from '../../../features/integrations/api/integrationsApi';

interface IntegrationDetailOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  integration: OMSIntegration | null;
  customerName: string;
  referenceAreaWidth: number;
}

const IntegrationDetailOverlay: React.FC<IntegrationDetailOverlayProps> = ({
  isOpen,
  onClose,
  integration,
  customerName,
  referenceAreaWidth
}) => {
  const [orders, setOrders] = useState<OMSOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!integration) return;
    try {
      setIsLoading(true);
      const data = await getOrdersByIntegrationId(integration.id, customerName);
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [integration, customerName]);

  useEffect(() => {
    if (!isOpen || !integration) return;
    loadOrders();
  }, [isOpen, integration, loadOrders]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case '배송완료':
        return 'green' as const;
      case '배송중':
        return 'blue' as const;
      case '주문확인':
        return 'orange' as const;
      case '취소':
        return 'red' as const;
      default:
        return 'neutral' as const;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  const getIntegrationStatusBadgeColor = (status: OMSIntegration['status']) => {
    switch (status) {
      case 'connected':
        return 'green' as const;
      case 'disconnected':
        return 'red' as const;
      case 'not_configured':
        return 'neutral' as const;
      default:
        return 'neutral' as const;
    }
  };

  const getIntegrationStatusText = (status: OMSIntegration['status']) => {
    switch (status) {
      case 'connected':
        return '연결됨';
      case 'disconnected':
        return '연결 끊김';
      case 'not_configured':
        return '미연동';
      default:
        return '알 수 없음';
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const calculatedWidth = referenceAreaWidth;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-50"
          onClick={onClose}
        >
          
      <div
        className={`
          fixed top-0 right-0 bottom-0 bg-white transform transition-transform duration-300 ease-in-out z-50 border-l border-gray-200
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ width: `${calculatedWidth}px` }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <Button
                onClick={onClose}
                variant="iconOnly"
                buttonStyle="ghost"
                size="sm"
                leadIcon={<Icon iconType={['arrows', 'arrow-left']} size={20} color="default-subtle" />}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {integration?.name || 'OMS 상세'}
                </h3>
                {integration && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="dot"
                      label={getIntegrationStatusText(integration.status)}
                      color={getIntegrationStatusBadgeColor(integration.status)}
                      size="sm"
                      shape="pill"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={loadOrders}
                disabled={isLoading}
                buttonStyle="ghost"
                size="sm"
                leadIcon={<Icon iconType={['system', 'refresh']} size={16} className={isLoading ? 'animate-spin' : ''} />}
              >
                새로고침
              </Button>
              <Button
                onClick={() => alert('다운로드 기능은 준비 중입니다.')}
                buttonStyle="ghost"
                size="sm"
                leadIcon={<Icon iconType={['system', 'download']} size={16} />}
              >
                내보내기
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">로딩 중...</div>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="text-gray-400 mb-2">주문 데이터가 없습니다.</div>
                <Button
                  onClick={loadOrders}
                  buttonStyle="ghost"
                  size="sm"
                >
                  다시 불러오기
                </Button>
              </div>
            ) : (
              <div className="p-4">
                <div className="mb-3 text-sm text-gray-600">
                  고객명: <span className="font-semibold text-gray-800">{customerName}</span>
                </div>

                <div className="space-y-2">
                  {orders.map((order) => (
                    <Card key={order.id} variant="outline" className="hover:shadow-md transition-shadow">
                      <Collapsible
                        open={expandedOrderId === order.id}
                        onOpenChange={() => toggleOrderExpansion(order.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                              <div>
                                <div className="text-xs text-gray-500 mb-1">주문번호</div>
                                <div className="text-sm font-medium text-gray-800">{order.order_number}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 mb-1">상품명</div>
                                <div className="text-sm text-gray-800">{order.product}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 mb-1">금액</div>
                                <div className="text-sm font-medium text-gray-800">{formatAmount(order.amount)}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 mb-1">상태</div>
                                <Badge label={order.status} color={getStatusBadgeColor(order.status)} size="sm" shape="pill" />
                              </div>
                            </div>
                            <div className="ml-4">
                              {expandedOrderId === order.id ? (
                                <Icon iconType={['arrows', 'arrow-up-s']} size={20} color="default-muted" />
                              ) : (
                                <Icon iconType={['arrows', 'arrow-down-s']} size={20} color="default-muted" />
                              )}
                            </div>
                          </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          {order.details && (
                            <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-200">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2">주문 정보</h4>

                                  <div>
                                    <div className="text-xs text-gray-500">주문일시</div>
                                    <div className="text-sm text-gray-800">{formatDate(order.order_date)}</div>
                                  </div>

                                  {order.details.product_sku && (
                                    <div>
                                      <div className="text-xs text-gray-500">상품코드</div>
                                      <div className="text-sm text-gray-800">{order.details.product_sku}</div>
                                    </div>
                                  )}

                                  {order.details.product_options && (
                                    <div>
                                      <div className="text-xs text-gray-500">상품옵션</div>
                                      <div className="text-sm text-gray-800">{order.details.product_options}</div>
                                    </div>
                                  )}

                                  <div>
                                    <div className="text-xs text-gray-500">수량</div>
                                    <div className="text-sm text-gray-800">{order.details.quantity}개</div>
                                  </div>

                                  <div>
                                    <div className="text-xs text-gray-500">단가</div>
                                    <div className="text-sm text-gray-800">{formatAmount(order.details.unit_price)}</div>
                                  </div>

                                  {order.details.discount > 0 && (
                                    <div>
                                      <div className="text-xs text-gray-500">할인</div>
                                      <div className="text-sm text-red-600">-{formatAmount(order.details.discount)}</div>
                                    </div>
                                  )}

                                  {order.details.shipping_fee > 0 && (
                                    <div>
                                      <div className="text-xs text-gray-500">배송비</div>
                                      <div className="text-sm text-gray-800">{formatAmount(order.details.shipping_fee)}</div>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2">배송 정보</h4>

                                  <div>
                                    <div className="text-xs text-gray-500">수령인</div>
                                    <div className="text-sm text-gray-800">{order.details.receiver_name}</div>
                                  </div>

                                  <div>
                                    <div className="text-xs text-gray-500">연락처</div>
                                    <div className="text-sm text-gray-800">{order.details.receiver_phone}</div>
                                  </div>

                                  <div>
                                    <div className="text-xs text-gray-500">배송지</div>
                                    <div className="text-sm text-gray-800">{order.details.shipping_address}</div>
                                  </div>

                                  {order.details.shipping_message && (
                                    <div>
                                      <div className="text-xs text-gray-500">배송메시지</div>
                                      <div className="text-sm text-gray-800">{order.details.shipping_message}</div>
                                    </div>
                                  )}

                                  {order.details.shipping_company && (
                                    <div>
                                      <div className="text-xs text-gray-500">택배사</div>
                                      <div className="text-sm text-gray-800">{order.details.shipping_company}</div>
                                    </div>
                                  )}

                                  {order.details.tracking_number && (
                                    <div>
                                      <div className="text-xs text-gray-500">송장번호</div>
                                      <div className="text-sm text-gray-800 font-mono">{order.details.tracking_number}</div>
                                    </div>
                                  )}

                                  <div className="pt-2 border-t border-gray-200">
                                    <div className="text-xs text-gray-500">결제수단</div>
                                    <div className="text-sm text-gray-800">{order.details.payment_method}</div>
                                  </div>

                                  <div>
                                    <div className="text-xs text-gray-500">결제일시</div>
                                    <div className="text-sm text-gray-800">{formatDate(order.details.payment_date)}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <div>총 {orders.length}개의 주문</div>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
      </div>
      )}

    </>
  );
};

export default IntegrationDetailOverlay;
