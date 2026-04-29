import { privateHttp } from "@/lib/http";

export const getAiAgentStatus$ = ({
  roomId,
  siteId,
}: {
  roomId: string;
  siteId: string;
}) => privateHttp.get(`/api/v1/sites/${siteId}/agent/${roomId}`);
