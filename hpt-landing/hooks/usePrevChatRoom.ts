import { useCallback } from 'react';

import { usePathname } from 'next/navigation';

import { useAuthStore } from '@/stores/authStore';

const LOCAL_ING_ROOM_ID = 'happytalkio_ingRoomId';

export default function usePrevChatRoom() {
  const pathname = usePathname();
  const { siteId } = useAuthStore();

  const isEmbedChat = pathname === '/embed/chat';

  const setIngRoom = useCallback(
    (roomId: string) => {
      if (isEmbedChat) return;
      localStorage.setItem(`${LOCAL_ING_ROOM_ID}_${siteId}`, roomId);
    },
    [siteId, isEmbedChat],
  );

  const getIngRoom = useCallback(() => {
    if (isEmbedChat) return null;
    return localStorage.getItem(`${LOCAL_ING_ROOM_ID}_${siteId}`);
  }, [siteId, isEmbedChat]);

  const removeIngRoom = useCallback(() => {
    localStorage.removeItem(`${LOCAL_ING_ROOM_ID}_${siteId}`);
  }, [siteId]);

  return {
    setIngRoom,
    getIngRoom,
    removeIngRoom,
  };
}
