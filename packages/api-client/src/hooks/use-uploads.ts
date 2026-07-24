import { useMutation } from "@tanstack/react-query"

import { ApiError } from "@workspace/api-client/client"
import { useAuthStore } from "@workspace/api-client/auth-store"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

export interface UploadResponse {
  url: string
}

interface UploadInput {
  file: File
  // Namespaces where the backend stores/serves the file from (e.g.
  // "categories") — see be-bagastopup's UploadHandler comment for why
  // this is generic instead of a resource-specific endpoint.
  folder: string
}

interface UploadErrorBody {
  error?: string
}

// uploadFile can't go through apiFetch (client.ts) — that wrapper
// always JSON-encodes the body and sets Content-Type: application/json,
// but this needs multipart/form-data. It still attaches the same
// bearer token and throws the same ApiError shape apiFetch does, so
// callers (react-hook-form submit handlers) handle failures identically
// to any other mutation.
async function uploadFile({ file, folder }: UploadInput): Promise<UploadResponse> {
  const token = useAuthStore.getState().token

  const formData = new FormData()
  formData.append("file", file)
  formData.append("folder", folder)

  const response = await fetch(`${API_BASE_URL}/api/v1/uploads`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  })

  if (!response.ok) {
    const message = await response
      .json()
      .then((data: UploadErrorBody) => data.error)
      .catch(() => undefined)
    throw new ApiError(
      response.status,
      message ?? `Upload failed with status ${response.status}`
    )
  }

  return response.json() as Promise<UploadResponse>
}

export function useUploadImage() {
  return useMutation({
    mutationFn: uploadFile,
  })
}
