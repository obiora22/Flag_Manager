export type FetchResponse<T> =
  | {
      status: "success";
      payload: T;
    }
  | {
      status: "network-error";
      error: string;
    }
  | {
      status: "api-error";
      error: string;
    };

export async function clientSideFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<FetchResponse<T>> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch the signed JWT from your server-side route
  let token: string | undefined;
  try {
    const tokenResponse = await fetch("/api/auth/token", {
      credentials: "include",
    });
    if (!tokenResponse.ok) {
      return {
        status: "api-error",
        error: "User is not authenticated!",
      } as const;
    }

    token = await tokenResponse.json();
  } catch (err) {
    return {
      status: "network-error",
      error: (err as unknown as Error).message,
    } as const;
  }

  console.log(`Fetching \`${API_URL}${path}\`...`);
  const hasBody = options.body !== undefined && options.body !== null;
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(hasBody ? { "content-type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      // API-level errors -- 4XX & 5XX errors
      return {
        status: "api-error",
        error: `Http error: ${response.status}`,
      } as const;
    }
    return {
      status: "success",
      payload: await response.json(),
    } as const;
  } catch (err) {
    // catch network-level errors
    return {
      status: "network-error",
      error: err instanceof Error ? err.message : String(err),
    } as const;
  }
}
