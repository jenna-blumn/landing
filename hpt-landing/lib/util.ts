function token() {
  return Math.floor((Math.random() + 1) * 0x10000)
    .toString(16)
    .substring(1);
}

export const guid = (): string => {
  return [token() + token(), token(), token(), token(), token() + token()].join(
    "-"
  );
};

export const getUniqueId = (siteId: string) => {
  if (typeof window === "undefined") return guid();

  const isEmbedChat = window.location.pathname === "/embed/chat";
  if (isEmbedChat) return guid();

  let userId = localStorage.getItem(`landing_userId_${siteId}`);
  if (userId) return userId;

  userId = guid();

  localStorage.setItem(`landing_userId_${siteId}`, userId);

  return userId;
};

export function chunkText(text: string) {
  const out: string[] = [];
  const clean = text.trim();
  let i = 0;
  while (i < clean.length) {
    const size = 8 + Math.floor(Math.random() * 7);
    out.push(clean.slice(i, i + size));
    i += size;
  }
  return out;
}

export const maskingText = (contents: string) => {
  if (!contents) return "";

  const maskingRepeatText = "*";
  const encryptRegExp = new RegExp(
    /\[::[A-Z0-9_]+::[a-z0-9]+::[a-zA-Z0-9-_.]+::]/g
  );

  // 컨텐츠내 민감정보 검색
  const maskedString = contents.replace(encryptRegExp, function (match) {
    const maskingCount =
      typeof match.split("::")[2] != "undefined" &&
      parseInt(match.split("::")[2]) > 0
        ? +match.split("::")[2]
        : 4;
    let maskingString = "";
    for (let cnt = 0; cnt < maskingCount; cnt++) {
      maskingString += maskingRepeatText;
    }

    return maskingString;
  });
  return maskedString;
};

export const filterSwears = ({
  message,
  swears,
}: {
  message: string;
  swears: string[];
}) => {
  const text = maskingText(message);

  const regex = new RegExp(swears.join("|"), "gi");
  return text.replace(regex, (val) => {
    return val.replace(/./g, "*");
  });
};

export const getMicroTime = () => {
  let now;

  // 채팅 서버 v2 연동하면서 문서로 건네준 코드로 작성.
  if (window.performance && (window as any).performance.now) {
    const timing = performance.timing;
    const start = (timing && timing.navigationStart) || Date.now();
    now = (start + performance.now()) * 1e3;
  } else {
    now = Date.now() * 1e3;
  }
  return now;
};

export function decodeBase64(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}
