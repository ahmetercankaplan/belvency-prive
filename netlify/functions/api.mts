import { handle } from "../../server/api.ts";

const api = async (req: Request) => handle(req);
export default api;

export const config = { path: "/api/*" };
