import type { User } from "@workspace/api-client/types/user"

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}
