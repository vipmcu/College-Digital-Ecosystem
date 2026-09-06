export interface ApiResponse<T> {
  data: T
  meta?: {
    total?: number
    page?: number
    limit?: number
    totalPages?: number
  }
}

export interface ApiErrorResponse {
  error: string
  code: string
  statusCode: number
  details?: unknown
}
