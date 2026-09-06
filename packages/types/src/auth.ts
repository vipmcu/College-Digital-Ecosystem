export type UserType = 'student' | 'staff' | 'instructor' | 'admin'

export type RoleCode =
  | 'student'
  | 'instructor'
  | 'registrar'
  | 'document_officer'
  | 'executive'
  | 'it_admin'
  | 'dpo'

export interface AuthUser {
  id: string
  keycloakId?: string
  username: string
  email: string
  firstNameTh: string
  lastNameTh: string
  firstNameEn?: string
  lastNameEn?: string
  userType: UserType
  orgUnitId?: string
  roles: RoleCode[]
}

export interface JwtTokenPayload {
  sub: string
  preferred_username: string
  email: string
  realm_access?: {
    roles: string[]
  }
}

export interface LoginRequestDto {
  username: string
  password: string
}

export interface LoginResponseDto {
  accessToken: string
  refreshToken: string
  expiresIn: number
  refreshExpiresIn: number
  user: AuthUser
}

export interface RefreshTokenRequestDto {
  refreshToken: string
}

export interface CreateUserRequestDto {
  username: string
  email: string
  firstNameTh: string
  lastNameTh: string
  firstNameEn?: string
  lastNameEn?: string
  userType: UserType
  orgUnitId?: string
  roles: RoleCode[]
}

export interface UpdateUserRequestDto {
  firstNameTh?: string
  lastNameTh?: string
  firstNameEn?: string
  lastNameEn?: string
  orgUnitId?: string
  isActive?: boolean
  roles?: RoleCode[]
}

export interface BulkImportRowDto {
  username: string
  email: string
  firstNameTh: string
  lastNameTh: string
  firstNameEn?: string
  lastNameEn?: string
  userType: UserType
  roles?: string
  orgUnitCode?: string
}

export interface BulkImportResultDto {
  totalRows: number
  successCount: number
  failedCount: number
  errors: Array<{
    row: number
    username?: string
    error: string
  }>
}
