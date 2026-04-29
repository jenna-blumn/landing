import { useCallback, useEffect } from 'react';

import { getToken$, validateToken$ } from '@/api/auth';
import { decodeBase64 } from '@/lib/util';
import { isDemoMode } from '@/lib/demoMode';
import { useAuthStore } from '@/stores/authStore';

export default function useAuth() {
  const { siteId, isAuth, setAuthStatus } = useAuthStore();

  useEffect(() => {
    if (!isDemoMode() || isAuth) return;
    setAuthStatus(true);
  }, [isAuth, setAuthStatus]);

  const validateToken = useCallback(
    async ({ siteId }: { siteId: string }) => {
      try {
        const {
          data: { code },
        } = await validateToken$({
          siteId,
        });

        if (code === 200) {
          setAuthStatus(true);

          return;
        }
      } catch (error) {
        localStorage.removeItem('happytalkio_jwtToken');
        return error;
      }
    },
    [setAuthStatus],
  );

  const getToken = useCallback(
    async (siteId: string) => {
      try {
        const {
          data: {
            code,
            data: { jwtToken },
          },
        } = await getToken$({ siteId });

        if (code === 200) {
          setAuthStatus(true);
          localStorage.setItem(`happytalkio_jwtToken_${siteId}`, jwtToken);
        }
      } catch (error) {
        return error;
      }
    },
    [setAuthStatus],
  );

  const happytalkAuth = useCallback(async () => {
    if (!siteId) return;

    const jwtToken = localStorage.getItem(`happytalkio_jwtToken_${siteId}`);

    if (jwtToken) {
      const existingSiteId = String(decodeBase64(jwtToken).site_id);

      if (existingSiteId === siteId) {
        await validateToken({ siteId });
        return;
      }

      if (existingSiteId !== siteId) {
        getToken(siteId);
        return;
      }
    }
    // 토큰이 없으면 토큰 생성
    if (!jwtToken) {
      getToken(siteId);
    }
  }, [getToken, siteId, validateToken]);

  useEffect(() => {
    if (isDemoMode() || isAuth) return;

    happytalkAuth();
  }, [isAuth, happytalkAuth]);
}
