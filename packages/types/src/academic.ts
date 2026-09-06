export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'suspended' | 'withdrawn'
export type EnrollmentStatus = 'enrolled' | 'withdrawn' | 'completed'
export type CourseType = 'lecture' | 'lab' | 'seminar'

export interface StudentProfile {
  id: string
  userId: string
  studentCode: string
  enrollmentYear: number
  programId?: string
  status: StudentStatus
}

export interface CourseSectionSchedule {
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'
  start: string
  end: string
}
