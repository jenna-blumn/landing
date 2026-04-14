import React, { useState, useRef, useEffect } from 'react';
import { Button, Icon, ScrollArea } from '@blumnai-studio/blumnai-design-system';
import { OmsConnectionConfig, OmsInfo } from '../types/sideTab';

interface OmsContentPlaceholderProps {
  oms: OmsInfo;
  config: OmsConnectionConfig;
  color: string;
  onEditConfig: () => void;
}

interface OrderDetail {
  orderNumber: string;
  productName: string;
  amount: number;
  status: string;
  statusColor: string;
  orderDate: string;
  productCode: string;
  productSpec: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  recipient: string;
  phone: string;
  address: string;
  deliveryCompany: string;
  trackingNumber: string;
  paymentMethod: string;
  paymentDate: string;
}

const mockOrders: OrderDetail[] = [
  {
    orderNumber: 'NV-202401170',
    productName: '프리미엄 화장품 세트',
    amount: 120000,
    status: '배송완료',
    statusColor: '#10B981',
    orderDate: '2024. 01. 16. 오후 06:15',
    productCode: 'MS-NVY-L-003',
    productSpec: '사이즈: L, 색상: 네이비',
    quantity: 2,
    unitPrice: 35000,
    discount: -11000,
    recipient: '김고객',
    phone: '010-1234-5678',
    address: '서울시 강남구 테헤란로 123, 101동 1001호',
    deliveryCompany: 'CJ대한통운',
    trackingNumber: '234567890123',
    paymentMethod: '신용카드',
    paymentDate: '2024. 01. 16. 오후 06:15'
  },
  {
    orderNumber: 'NV-202401160',
    productName: '남성 겨울 세조 선물 세트',
    amount: 59000,
    status: '배송중',
    statusColor: '#3B82F6',
    orderDate: '2024. 01. 15. 오전 10:30',
    productCode: 'WS-BLK-M-125',
    productSpec: '사이즈: M, 색상: 블랙',
    quantity: 1,
    unitPrice: 59000,
    discount: 0,
    recipient: '이영희',
    phone: '010-2345-6789',
    address: '경기도 성남시 분당구 판교역로 235, 3층',
    deliveryCompany: '로젠택배',
    trackingNumber: '345678901234',
    paymentMethod: '신용카드',
    paymentDate: '2024. 01. 15. 오전 10:30'
  },
  {
    orderNumber: 'NV-202401150',
    productName: '여성 가죽 핸드백',
    amount: 185000,
    status: '배송완료',
    statusColor: '#10B981',
    orderDate: '2024. 01. 14. 오후 03:20',
    productCode: 'HB-BRN-F-089',
    productSpec: '색상: 브라운',
    quantity: 1,
    unitPrice: 195000,
    discount: -10000,
    recipient: '박민수',
    phone: '010-3456-7890',
    address: '인천시 연수구 송도과학로 32, 202동 1502호',
    deliveryCompany: 'CJ대한통운',
    trackingNumber: '456789012345',
    paymentMethod: '네이버페이',
    paymentDate: '2024. 01. 14. 오후 03:20'
  },
  {
    orderNumber: 'NV-202401140',
    productName: '런닝화 (운동화)',
    amount: 98000,
    status: '주문확인',
    statusColor: '#F59E0B',
    orderDate: '2024. 01. 13. 오후 08:45',
    productCode: 'SH-WHT-270-456',
    productSpec: '사이즈: 270, 색상: 화이트',
    quantity: 1,
    unitPrice: 98000,
    discount: 0,
    recipient: '최지영',
    phone: '010-4567-8901',
    address: '부산시 해운대구 센텀중앙로 97, 1204호',
    deliveryCompany: '한진택배',
    trackingNumber: '567890123456',
    paymentMethod: '카카오페이',
    paymentDate: '2024. 01. 13. 오후 08:45'
  },
  {
    orderNumber: 'NV-202401120',
    productName: '키케어 키트',
    amount: 145000,
    status: '배송중',
    statusColor: '#3B82F6',
    orderDate: '2024. 01. 12. 오전 11:15',
    productCode: 'KC-SET-A-012',
    productSpec: '세트 구성: A형',
    quantity: 1,
    unitPrice: 145000,
    discount: 0,
    recipient: '정수진',
    phone: '010-5678-9012',
    address: '대전시 유성구 대학로 291, 105동 603호',
    deliveryCompany: '우체국택배',
    trackingNumber: '678901234567',
    paymentMethod: '신용카드',
    paymentDate: '2024. 01. 12. 오전 11:15'
  }
];

const OmsContentPlaceholder: React.FC<OmsContentPlaceholderProps> = ({
  oms: _oms,
  config: _config,
  color: _color,
  onEditConfig: _onEditConfig,
}) => {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const isWideLayout = containerWidth >= 420;

  const toggleOrder = (orderNumber: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderNumber)) {
        newSet.delete(orderNumber);
      } else {
        newSet.add(orderNumber);
      }
      return newSet;
    });
  };

  return (
    <div ref={containerRef} className="h-full flex flex-col bg-gray-50">
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="mb-3">
            <p className="text-xs text-gray-500">고객명</p>
            <p className="text-sm font-medium text-gray-900 mt-1">김고객</p>
          </div>

          <div className="space-y-2">
            {mockOrders.map((order) => {
              const isExpanded = expandedOrders.has(order.orderNumber);

              return (
                <div
                  key={order.orderNumber}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  {isWideLayout ? (
                    <div className="p-2.5">
                      <div className="flex items-center justify-between gap-2 min-h-[52px]">
                        <div className="flex-1 grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center">
                          <div className="min-w-0">
                            <span className="text-[10px] text-gray-500 block mb-0.5">주문번호</span>
                            <span className="text-xs font-medium text-blue-600 block truncate">
                              {order.orderNumber}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] text-gray-500 block mb-0.5">상품명</span>
                            <p className="text-xs font-medium text-gray-900 truncate">
                              {order.productName}
                            </p>
                          </div>
                          <div className="text-right whitespace-nowrap">
                            <span className="text-[10px] text-gray-500 block mb-0.5">금액</span>
                            <p className="text-xs font-semibold text-gray-900">
                              {order.amount.toLocaleString()}원
                            </p>
                          </div>
                          <div className="text-right whitespace-nowrap">
                            <span className="text-[10px] text-gray-500 block mb-0.5">상태</span>
                            <p
                              className="text-xs font-medium"
                              style={{ color: order.statusColor }}
                            >
                              {order.status}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="iconOnly"
                          buttonStyle="ghost"
                          size="2xs"
                          onClick={() => toggleOrder(order.orderNumber)}
                          className="flex-shrink-0"
                          leadIcon={isExpanded ? (
                            <Icon iconType={['arrows', 'arrow-up-s']} size={16} color="default-muted" />
                          ) : (
                            <Icon iconType={['arrows', 'arrow-down-s']} size={16} color="default-muted" />
                          )}
                        />
                      </div>

                      {isExpanded && (
                        <div className="pt-3 mt-3 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-semibold text-gray-700 mb-2">
                                주문 정보
                              </h4>
                              <div className="space-y-1.5">
                                <div>
                                  <span className="text-xs text-gray-500">주문일시</span>
                                  <p className="text-xs text-gray-900">{order.orderDate}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">상품코드</span>
                                  <p className="text-xs text-blue-600">{order.productCode}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">상품분류</span>
                                  <p className="text-xs text-gray-900">{order.productSpec}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">수량</span>
                                  <p className="text-xs text-gray-900">{order.quantity}개</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">단가</span>
                                  <p className="text-xs text-gray-900">
                                    {order.unitPrice.toLocaleString()}원
                                  </p>
                                </div>
                                {order.discount !== 0 && (
                                  <div>
                                    <span className="text-xs text-gray-500">할인</span>
                                    <p className="text-xs text-red-600">
                                      {order.discount.toLocaleString()}원
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-xs font-semibold text-gray-700 mb-2">
                                배송 정보
                              </h4>
                              <div className="space-y-1.5">
                                <div>
                                  <span className="text-xs text-gray-500">수령인</span>
                                  <p className="text-xs text-gray-900">{order.recipient}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">연락처</span>
                                  <p className="text-xs text-gray-900">{order.phone}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">배송지</span>
                                  <p className="text-xs text-gray-900 leading-relaxed">
                                    {order.address}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">택배사</span>
                                  <p className="text-xs text-gray-900">{order.deliveryCompany}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">송장번호</span>
                                  <p className="text-xs text-gray-900">{order.trackingNumber}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">결제수단</span>
                                  <p className="text-xs text-gray-900">{order.paymentMethod}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">결제일시</span>
                                  <p className="text-xs text-gray-900">{order.paymentDate}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div>
                            <span className="text-[10px] text-gray-500">주문번호</span>
                            <span className="text-xs font-medium text-blue-600 block">
                              {order.orderNumber}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500">상품명</span>
                            <p className="text-xs font-medium text-gray-900">
                              {order.productName}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500">상태</span>
                            <p
                              className="text-xs font-medium"
                              style={{ color: order.statusColor }}
                            >
                              {order.status}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="iconOnly"
                          buttonStyle="ghost"
                          size="2xs"
                          onClick={() => toggleOrder(order.orderNumber)}
                          className="flex-shrink-0"
                          leadIcon={isExpanded ? (
                            <Icon iconType={['arrows', 'arrow-up-s']} size={16} color="default-muted" />
                          ) : (
                            <Icon iconType={['arrows', 'arrow-down-s']} size={16} color="default-muted" />
                          )}
                        />
                      </div>

                      {isExpanded && (
                        <div className="pt-3 mt-3 border-t border-gray-100">
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-xs font-semibold text-gray-700 mb-2">
                                주문 정보
                              </h4>
                              <div className="space-y-1.5">
                                <div>
                                  <span className="text-xs text-gray-500">금액</span>
                                  <p className="text-xs font-semibold text-gray-900">
                                    {order.amount.toLocaleString()}원
                                  </p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">주문일시</span>
                                  <p className="text-xs text-gray-900">{order.orderDate}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">상품코드</span>
                                  <p className="text-xs text-blue-600">{order.productCode}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">상품분류</span>
                                  <p className="text-xs text-gray-900">{order.productSpec}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">수량</span>
                                  <p className="text-xs text-gray-900">{order.quantity}개</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">단가</span>
                                  <p className="text-xs text-gray-900">
                                    {order.unitPrice.toLocaleString()}원
                                  </p>
                                </div>
                                {order.discount !== 0 && (
                                  <div>
                                    <span className="text-xs text-gray-500">할인</span>
                                    <p className="text-xs text-red-600">
                                      {order.discount.toLocaleString()}원
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-xs font-semibold text-gray-700 mb-2">
                                배송 정보
                              </h4>
                              <div className="space-y-1.5">
                                <div>
                                  <span className="text-xs text-gray-500">수령인</span>
                                  <p className="text-xs text-gray-900">{order.recipient}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">연락처</span>
                                  <p className="text-xs text-gray-900">{order.phone}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">배송지</span>
                                  <p className="text-xs text-gray-900 leading-relaxed">
                                    {order.address}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">택배사</span>
                                  <p className="text-xs text-gray-900">{order.deliveryCompany}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">송장번호</span>
                                  <p className="text-xs text-gray-900">{order.trackingNumber}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">결제수단</span>
                                  <p className="text-xs text-gray-900">{order.paymentMethod}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">결제일시</span>
                                  <p className="text-xs text-gray-900">{order.paymentDate}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">총 {mockOrders.length}개의 주문</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default OmsContentPlaceholder;
