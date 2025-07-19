import type { paths } from "@/lib/backend/api/schema";
import createClient from "openapi-fetch";

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const client = createClient<paths>({ // paths를 통해서 client는 백엔드에 대해서 자세히 알 수 있다.
    baseUrl: NEXT_PUBLIC_API_BASE_URL,
    credentials: "include",
});

export default client;