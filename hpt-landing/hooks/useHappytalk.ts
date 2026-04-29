import { useCallback, useEffect, useRef, useState } from 'react';

import { isDemoMode } from '@/lib/demoMode';

export default function useHappytalk() {
  const htRef = useRef(null);
  const [isSDKReady, setIsSDKReady] = useState(false);

  const demoMode = isDemoMode();

  const callHappytalk = useCallback(() => {
    document.getElementById('HappytalkIframe')?.remove();

    const defaultOptions = {
      siteId: '4000000015',
      siteName: '해피톡',
      categoryId: '61504',
      divisionId: '61505',
      kakaoId: '@해피톡io',
      naverId: 'wcb559',
      dynamicScript: true,
    };

    htRef.current = new (window as any).Happytalk(defaultOptions);
  }, []);

  const callHappytalkSDK = useCallback(() => {
    const tagName = 'script',
      $script = document.createElement(tagName),
      $element = document.getElementsByTagName(tagName)[0];

    $script.id = 'happytalkSDK';
    $script.async = true;
    $script.src =
      'https://chat-static.happytalkio.com/sdk/happytalk.chat.v2.min.js';

    $script.addEventListener(
      'load',
      function () {
        setIsSDKReady(true);
      },
      false,
    );
    $element.parentNode?.insertBefore($script, $element);
  }, []);

  useEffect(() => {
    if (demoMode || isSDKReady || htRef.current) return;

    callHappytalkSDK();
  }, [callHappytalkSDK, isSDKReady, demoMode]);

  useEffect(() => {
    if (demoMode || !isSDKReady) return;

    callHappytalk();
  }, [callHappytalk, isSDKReady, demoMode]);
}
