const rawApiUrl = import.meta.env.VITE_API_URL;
const BASE_URL = rawApiUrl && rawApiUrl.startsWith("/")
  ? (rawApiUrl.endsWith("/customer-beta") ? rawApiUrl : `${rawApiUrl}/customer-beta`)
  : "/customer-beta";


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
        : typeof body === "string" && body.length > 0
        ? body
        : `Request failed with status ${status}`;
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function hasValidToken(): boolean {
  const token = localStorage.getItem("token");
  return Boolean(token && token !== "undefined" && token !== "null" && token.trim().length > 0);
}

let isRedirectingToLogin = false;

export function resetRedirectGuard() {
  isRedirectingToLogin = false;
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  if (token && token !== "undefined" && token !== "null" && token.trim().length > 0) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
  const fullBase = BASE_URL.startsWith("http")
    ? BASE_URL
    : `${window.location.origin}${BASE_URL}`;
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

export function getAssetUrl(path?: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const fullBase = BASE_URL.startsWith("http")
    ? BASE_URL
    : `${window.location.origin}${BASE_URL}`;
  return `${fullBase}${cleanPath}`;
}

export async function downloadFile(path: string, fallbackFileName: string = "download.pdf"): Promise<void> {
  const url = buildUrl(path);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    let errText = "Failed to download file";
    try {
      const errObj = await response.json();
      if (errObj && errObj.error) errText = errObj.error;
    } catch {}
    throw new ApiError(response.status, { error: errText });
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get("Content-Disposition");
  let filename = fallbackFileName;
  if (contentDisposition) {
    const match = contentDisposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i);
    if (match && match[1]) {
      filename = decodeURIComponent(match[1]);
    }
  }

  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
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
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("selectedMemberId");
      if (window.location.pathname !== "/" && !isRedirectingToLogin) {
        isRedirectingToLogin = true;
        window.location.href = "/";
      }
    }
    throw new ApiError(response.status, body);
  }

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
    return handleResponse<T>(response);
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
    return handleResponse<T>(response);
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
    return handleResponse<T>(response);
  },

  async del<T>(path: string): Promise<ApiResponse<T>> {
    const response = await fetch(buildUrl(path), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return handleResponse<T>(response);
  },
};

export { ApiError };
