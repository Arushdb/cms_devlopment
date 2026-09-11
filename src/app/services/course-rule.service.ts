import { Injectable } from '@angular/core';
import { CourseGroupRelationRule } from '../interfaces/course-group-relation-rule';

@Injectable({
  providedIn: 'root'
})
export class CourseRuleService {

  constructor() {}


  checkDependency(
    node: any,
    rule: CourseGroupRelationRule,
    getValue: (value: any) => string,
    getSelectedCredits: (groupCode: string) => number,
    getSelectedDisciplines: (
      groupCode: string,
      node: any
    ) => string[]
  ): {
    valid: boolean;
    message: string;
  } {

    if (!rule) {
      return {
        valid: true,
        message: ''
      };
    }


    switch (rule.dependency_type) {

      case 'GROUP_SELECTED':

        return this.checkGroupSelected(
          rule,
          getSelectedCredits
        );


      case 'MIN_CREDIT':

        return this.checkMinCredit(
          node,
          rule,
          getValue,
          getSelectedCredits,
          getSelectedDisciplines
        );


      case 'DISCIPLINE':

        return this.checkDiscipline(
          node,
          rule,
          getValue,
          getSelectedDisciplines
        );


      default:

        return {
          valid: true,
          message: ''
        };
    }
  }


  private checkGroupSelected(
    rule: CourseGroupRelationRule,
    getSelectedCredits: (
      groupCode: string
    ) => number
  ): {
    valid: boolean;
    message: string;
  } {

    const selectedCredits =
      getSelectedCredits(
        rule.required_group_code
      );

    if (selectedCredits <= 0) {

      return {
        valid: false,
        message:
          'Please select at least one course from ' +
          rule.required_group_code +
          ' group.'
      };
    }

    return {
      valid: true,
      message: ''
    };
  }


  private checkMinCredit1(
    node: any,
    rule: CourseGroupRelationRule,
    getValue: (value: any) => string,
    getSelectedCredits: (
      groupCode: string
    ) => number,
    getSelectedDisciplines: (
      groupCode: string,
      node: any
    ) => string[]
  ): {
    valid: boolean;
    message: string;
  } {

    const selectedCredits =
      getSelectedCredits(
        rule.required_group_code
      );

    const requiredCredit =
      Number(rule.required_credit);


    // Minimum credit
    if (selectedCredits < requiredCredit) {

      return {
        valid: false,
        message:
          'You must select at least ' +
          requiredCredit +
          ' credits from ' +
          rule.required_group_code +
          ' group.'
      };
    }


    // No discipline rule
    if (!rule.discipline_rule) {

      return {
        valid: true,
        message: ''
      };
    }


    return this.checkDisciplineRule(
      node,
      rule,
      getValue,
      getSelectedDisciplines
    );
  }
private checkMinCredit(
  node: any,
  rule: CourseGroupRelationRule,
  getValue: (value: any) => string,
  getSelectedCredits: (
    groupCode: string
  ) => number,
  getSelectedDisciplines: (
    groupCode: string,
    node?: any
  ) => string[]
): {
  valid: boolean;
  message: string;
} {

  // ------------------------------------
  // 1. Check minimum credits
  // ------------------------------------
  const selectedCredits =
    getSelectedCredits(
      rule.required_group_code
    );

  const requiredCredit =
    Number(rule.required_credit);

  if (selectedCredits < requiredCredit) {

    return {
      valid: false,
      message:
        'You must select at least ' +
        requiredCredit +
        ' credits from ' +
        rule.required_group_code +
        ' group.'
    };
  }


  // ------------------------------------
  // 2. No discipline rule
  // ------------------------------------
  if (!rule.discipline_rule) {

    return {
      valid: true,
      message: ''
    };
  }


  // ------------------------------------
  // 3. Check SINGLE discipline selection
  //    for dependent/current group
  // ------------------------------------
  if (rule.discipline_selection === 'SINGLE') {
debugger;
    const dependentGroupCode =
      rule.dependent_group_code;
      console.log('Dependent Group Code:', dependentGroupCode);

    const dependentDisciplines =
      getSelectedDisciplines(
        dependentGroupCode
        
        
      );

    if (dependentDisciplines.length !== 1) {

      return {
        valid: false,
        message:
          'Only one discipline can be selected from ' +
          dependentGroupCode +
          ' group.'
      };
    }
  }


  // ------------------------------------
  // 4. Check DIFFERENT discipline rule
  // ------------------------------------
  return this.checkDisciplineRule(
    node,
    rule,
    getValue,
    getSelectedDisciplines
  );
}

  private checkDiscipline(
    node: any,
    rule: CourseGroupRelationRule,
    getValue: (value: any) => string,
    getSelectedDisciplines: (
      groupCode: string,
      node: any
    ) => string[]
  ): {
    valid: boolean;
    message: string;
  } {

    return this.checkDisciplineRule(
      node,
      rule,
      getValue,
      getSelectedDisciplines
    );
  }


  private checkDisciplineRule(
    node: any,
    rule: CourseGroupRelationRule,
    getValue: (value: any) => string,
    getSelectedDisciplines: (
      groupCode: string,
      node: any
    ) => string[]
  ): {
    valid: boolean;
    message: string;
  } {

    const currentDiscipline =
      getValue(node.data.discipline);
    debugger;

    if (!currentDiscipline) {

      return {
        valid: true,
        message: ''
      };
    }


    const selectedDisciplines =
      getSelectedDisciplines(
        rule.required_group_code,
        node
      );


    if (selectedDisciplines.length === 0) {

      return {
        valid: true,
        message: ''
      };
    }


    switch (rule.discipline_rule) {

      case 'SAME':

        return this.checkSameDiscipline(
          currentDiscipline,
          selectedDisciplines,
          rule
        );


      case 'DIFFERENT':

        return this.checkDifferentDiscipline(
          currentDiscipline,
          selectedDisciplines,
          rule
        );


      default:

        return {
          valid: true,
          message: ''
        };
    }
  }


  private checkSameDiscipline(
    currentDiscipline: string,
    selectedDisciplines: string[],
    rule: CourseGroupRelationRule
  ): {
    valid: boolean;
    message: string;
  } {

    if (
      selectedDisciplines.indexOf(
        currentDiscipline
      ) === -1
    ) {

      return {
        valid: false,
        message:
          'You must select a course from the same discipline as the courses already selected in ' +
          rule.required_group_code +
          ' group.'
      };
    }

    return {
      valid: true,
      message: ''
    };
  }


  private checkDifferentDiscipline(
    currentDiscipline: string,
    selectedDisciplines: string[],
    rule: CourseGroupRelationRule
  ): {
    valid: boolean;
    message: string;
  } {

    // DIFFERENT + SINGLE
    if (
      rule.discipline_selection === 'SINGLE' &&
      selectedDisciplines.length > 1
    ) {

      return {
        valid: false,
        message:
          'Only one discipline can be selected in ' +
          rule.required_group_code +
          ' group.'
      };
    }


    // Current discipline must be different
    if (
      selectedDisciplines.indexOf(
        currentDiscipline
      ) !== -1
    ) {

      return {
        valid: false,
        message:
          'The selected course must belong to a different discipline from the discipline selected in ' +
          rule.required_group_code +
          ' group.'
      };
    }


    return {
      valid: true,
      message: ''
    };
  }
}
