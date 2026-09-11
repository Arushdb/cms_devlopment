export interface GroupCreditRule {
  programCourseKey: string;
  courseGroupCode: string;
  minimumCredit: number;
  maximumCredit: number;
  elective: number;
  orderInMarksheet: number;
}
