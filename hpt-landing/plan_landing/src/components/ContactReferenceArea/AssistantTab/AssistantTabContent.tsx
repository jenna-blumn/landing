import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@blumnai-studio/blumnai-design-system';
import AIResponseTabContent from '../../../features/myKnowledge/components/AIResponseTabContent';
import TemplateTabContent from '../../../features/myKnowledge/components/TemplateTabContent';
import MyKnowledgeTabContent from '../../../features/myKnowledge/components/MyKnowledgeTabContent';

type AssistantSubTab = 'ai-response' | 'template' | 'my-knowledge';

const AssistantTabContent: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<AssistantSubTab>('my-knowledge');

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeSubTab} onValueChange={(val) => setActiveSubTab(val as AssistantSubTab)} className="flex-shrink-0">
        <TabsList variant="underline" type="fixed" size="sm">
          <TabsTrigger value="ai-response">AI 응답</TabsTrigger>
          <TabsTrigger value="template">템플릿</TabsTrigger>
          <TabsTrigger value="my-knowledge">내 지식</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex-1 overflow-hidden">
        {activeSubTab === 'ai-response' && <AIResponseTabContent />}
        {activeSubTab === 'template' && <TemplateTabContent />}
        {activeSubTab === 'my-knowledge' && <MyKnowledgeTabContent />}
      </div>
    </div>
  );
};

export default AssistantTabContent;
