export interface CourseGroupRelationRule {
  program_course_key: string;
  dependent_group_code: string;
  required_group_code: string;
  dependency_type: string;
  required_credit: number;
  discipline_rule: string | null;
  discipline_selection: string | null;
  active: number;
}
