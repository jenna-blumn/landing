import React from 'react';
import { Icon } from '@blumnai-studio/blumnai-design-system';

const AcknowledgementArea: React.FC = () => {
  const notifications = [
    {
      id: 1,
      type: 'info',
      message: 'System maintenance scheduled for tonight 2:00 AM - 4:00 AM',
      priority: 'medium'
    },
    {
      id: 2,
      type: 'alert',
      message: 'New policy update: Response time target reduced to 30 seconds',
      priority: 'high'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 px-4 py-2">
      <div className="flex items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Icon iconType={['media', 'notification']} size={16} color="informative" />
            <span className="font-medium text-blue-800 text-sm">Acknowledgement</span>
          </div>
          
          <div className="flex items-center gap-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center gap-2">
                {notification.type === 'alert' && (
                  <Icon iconType={['system', 'error-warning']} size={14} color="warning" />
                )}
                {notification.type === 'info' && (
                  <Icon iconType={['system', 'information']} size={14} color="informative" />
                )}
                <span className={`text-xs ${
                  notification.priority === 'high' 
                    ? 'text-orange-700 font-medium' 
                    : 'text-gray-700'
                }`}>
                  {notification.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcknowledgementArea;