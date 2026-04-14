interface AIGeneratedContent {
  title: string;
  summary: string;
}

export const generateMockAISummary = (): AIGeneratedContent => {
  return {
    title: "데이터 분석 부트캠프 중급편 관련 문의",
    summary: "고객이 데이터 분석 부트캠프 중급편 관련 문의를 하였으며, 실습 진도와 과제 수행 방법에 대한 질문을 주로 하였음. 전반적으로 긍정적인 학습 태도를 보이며 추가 학습 자료에 대한 관심을 표현함.",
  };
};
