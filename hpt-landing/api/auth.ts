import { privateHttp, publicHttp } from "@/lib/http";

export const getToken$ = ({ siteId }: { siteId: string }) =>
  publicHttp.get(`/api/v1/sites/${siteId}/auth`);

export const validateToken$ = ({ siteId }: { siteId: string }) =>
  privateHttp.get(`/api/v1/sites/${siteId}/auth/check`);
