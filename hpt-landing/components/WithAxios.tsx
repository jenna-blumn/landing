import { useEffect } from 'react';

import { useAuthStore } from '@/stores/authStore';
import { privateHttp, initializeHttp } from '@/lib/http';
import { decodeBase64 } from '@/lib/util';
import { isDemoMode } from '@/lib/demoMode';
import { getToken$ } from '@/api/auth';
import { useEnv } from '@/contexts/EnvContext';

export default function WithAxios({ children }: { children: React.ReactNode }) {
  const env = useEnv();
  const { siteId, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    initializeHttp({
      webChatUrl: env.WEB_CHAT_URL,
      webhookApiUrl: env.WEBHOOK_API_URL,
    });
  }, [env]);

  useEffect(() => {
    if (isDemoMode() || !siteId) return;

    const id = privateHttp.interceptors.request.use(
      async (config) => {
        const HAPPYTALK_JWTTOKEN_SITEID = `happytalkio_jwtToken_${siteId}`;

        let jwtToken = localStorage.getItem(HAPPYTALK_JWTTOKEN_SITEID);

        if (jwtToken) {
          const payload = decodeBase64(jwtToken);

          if (Date.now() > payload.exp * 1000) {
            const {
              data: { data },
            } = await getToken$({ siteId });

            jwtToken = data.jwtToken;

            localStorage.setItem(HAPPYTALK_JWTTOKEN_SITEID, jwtToken as any);
          }
        }

        config.headers.jwtToken = jwtToken;
        config.headers['Channel-Service-Id'] = siteId;

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    return () => {
      privateHttp.interceptors.request.eject(id);
    };
  }, [siteId]);

  return <div>{children}</div>;
}
