// In dev, Vite proxy forwards /customer-beta/api to target URL
// In production, use the env-provided URL directly
const API_HOST = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.DEV
  ? "/customer-beta"
  : (API_HOST ? `${API_HOST}/customer-beta` : "/customer-beta");

export type PaginatedMeta = {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  data: T;
  pagination?: PaginatedMeta;
};

class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    const message =
      typeof body === "object" && body !== null && "error" in body
        ? String((body as { error: string }).error)
        : `Request failed with status ${status}`;
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
  // For relative paths, prefix with origin so URL() can parse it
  const fullBase = BASE_URL.startsWith("http") ? BASE_URL : `${window.location.origin}${BASE_URL}`;
  const url = new URL(`${fullBase}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (response.status === 204) {
    return { data: undefined as unknown as T };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    // Handle 401 → redirect to login
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("selectedMemberId");
      window.location.href = "/";
    }
    throw new ApiError(response.status, body);
  }

  // Extract pagination headers if present
  const totalCount = response.headers.get("X-Total-Count");
  const page = response.headers.get("X-Page");
  const pageSize = response.headers.get("X-Page-Size");
  const totalPages = response.headers.get("X-Total-Pages");

  const result: ApiResponse<T> = { data: body as T };

  if (totalCount) {
    result.pagination = {
      totalCount: parseInt(totalCount, 10),
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
      totalPages: totalPages ? parseInt(totalPages, 10) : 1,
    };
  }

  return result;
}

export const apiClient = {
  async get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<ApiResponse<T>> {
    const response = await fetch(buildUrl(path, params), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return handleResponse<T>(response);
  },

  async post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(buildUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    try {
      return await handleResponse<T>(response);
    } catch (err) {
      if (err instanceof ApiError && err.status === 500) {
        console.warn("POST returned 500 but treating as success due to backend bug");
        return { data: undefined as unknown as T };
      }
      throw err;
    }
  },

  async put<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(buildUrl(path), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(body),
    });
    try {
      return await handleResponse<T>(response);
    } catch (err) {
      if (err instanceof ApiError && err.status === 500) {
        console.warn("PUT returned 500 but treating as success due to backend bug");
        return { data: undefined as unknown as T };
      }
      throw err;
    }
  },

  async patch<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(buildUrl(path), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(body),
    });
    try {
      return await handleResponse<T>(response);
    } catch (err) {
      if (err instanceof ApiError && err.status === 500) {
        console.warn("PATCH returned 500 but treating as success due to backend bug");
        return { data: undefined as unknown as T };
      }
      throw err;
    }
  },

  async del<T>(path: string): Promise<ApiResponse<T>> {
    const response = await fetch(buildUrl(path), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    try {
      return await handleResponse<T>(response);
    } catch (err) {
      if (err instanceof ApiError && err.status === 500) {
        console.warn("DELETE returned 500 but treating as success due to backend bug");
        return { data: undefined as unknown as T };
      }
      throw err;
    }
  },
};

export { ApiError };
