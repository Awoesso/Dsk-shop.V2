import { useState, useEffect, useCallback } from 'react';
import {
  NotificationsService,
  StoreNotification,
} from '../services/notifications.service';

export function useNotifications() {
  const [notifications, setNotifications] = useState<StoreNotification[]>([]);

  const addNotification = useCallback((notification: StoreNotification) => {
    setNotifications((prev) => [notification, ...prev.slice(0, 19)]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    const unsubscribe = NotificationsService.subscribeToStoreAnnouncements(
      (notification) => {
        addNotification(notification);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
}
