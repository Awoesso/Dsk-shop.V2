import { supabase } from '../lib/supabase';
import { sanitizeText } from '../utils/security';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface StoreNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
}

export const NotificationsService = {
  /**
   * Subscribes to Realtime store notifications broadcast from Nexa or system events.
   * Cleans up cleanly on unmount.
   */
  subscribeToStoreAnnouncements(
    onNotification: (notification: StoreNotification) => void
  ): () => void {
    const channelId = `broadcast:store_announcements:${Math.random().toString(36).substring(2, 9)}`;

    const channel: RealtimeChannel = supabase
      .channel(channelId)
      .on('broadcast', { event: 'store_announcement' }, (payload) => {
        if (!payload || !payload.payload) return;

        const raw = payload.payload;
        const notification: StoreNotification = {
          id: String(raw.id || Math.random().toString(36).substring(2, 9)),
          title: sanitizeText(raw.title || 'Annonce DSK-Shop'),
          message: sanitizeText(raw.message || ''),
          type: raw.type === 'warning' || raw.type === 'success' ? raw.type : 'info',
          timestamp: new Date().toISOString(),
        };

        onNotification(notification);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
