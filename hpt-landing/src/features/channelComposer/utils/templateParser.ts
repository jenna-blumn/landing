/**
 * 템플릿 텍스트에서 {{변수}} 패턴의 변수 키를 추출
 */
export function extractVariableKeys(content: string): string[] {
  const regex = /\{\{(\w+)\}\}/g;
  const keys: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (!keys.includes(match[1])) {
      keys.push(match[1]);
    }
  }
  return keys;
}

/**
 * 템플릿 텍스트의 {{변수}}를 실제 값으로 치환
 * 값이 없는 변수는 [라벨] 형태로 표시
 */
export function renderTemplate(
  content: string,
  variables: Record<string, string>,
  variableLabels?: Record<string, string>
): string {
  return content.replace(/\{\{(\w+)\}\}/g, (_match, key) => {
    if (variables[key] && variables[key].trim() !== '') {
      return variables[key];
    }
    const label = variableLabels?.[key] || key;
    return `[${label}]`;
  });
}

/**
 * 필수 변수가 모두 채워졌는지 확인
 */
export function areAllRequiredVariablesFilled(
  requiredKeys: string[],
  variables: Record<string, string>
): boolean {
  return requiredKeys.every(
    (key) => variables[key] !== undefined && variables[key].trim() !== ''
  );
}

/**
 * 채워지지 않은 필수 변수 목록 반환
 */
export function getMissingRequiredVariables(
  requiredKeys: string[],
  variables: Record<string, string>
): string[] {
  return requiredKeys.filter(
    (key) => !variables[key] || variables[key].trim() === ''
  );
}
