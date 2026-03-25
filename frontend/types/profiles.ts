import { Timestamp } from "next/dist/server/lib/cache-handlers/types"

export interface SignInRequest {
  email: string
  password: string
}

export interface SignInResponse {
  access_token: string
  refresh_token?: string
}

export interface Profiles {
  first_name?: string | null
  last_name?: string | null
  email: string
  avatar_url?: string | null
  role?: string | null
}
export interface SignUpRequest extends Profiles {password:string}

export interface ProfilesResponse extends Profiles {
  id: string
}