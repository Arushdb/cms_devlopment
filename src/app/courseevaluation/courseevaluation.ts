///  Author :Piyush Singh
//   Date Created: 14 jun 2024
//   Function : Interface file for course evaluation Component



//interface for assigned courses
export interface Courseevaluation {
coursecode:string;
semestercode:string;
componentdescription:string;
programname:string;
programcode:number;
branchcode:number;
branchdescription:string;
specializationcode:number;
specializationdescription:string;
pcd:number;
entityid:string;
programid:number;
}


//interface for assigned courses template
export interface Template{
coursecode:string;
semestercode:string;
programid:number;
    evaluationIdName:number;
    examdate:string;
    evaluationid:number;
    iddescription:string;
    groupid:string;
    groupName:string;
    rule:string;
    ruleName:string;
    orderinmarksheet:string;
    datetodisplay:string;
    datefromdisplay:string;
    maximummark:number;
    weightage:number;
    numberOfComponents: number;
}

