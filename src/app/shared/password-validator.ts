import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.value;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    debugger;
    console.log('in correct password');
    return {
      passwordStrength: {
        message:
          'Password must have at least 8 characters, including uppercase, lowercase, a number, and a special character.',
      },
    };
  }

  return null; // Return null if validation passes
}

export function matchPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordValue = control.get('fcnewpwd')?.value;
    const confirmPasswordValue = control.get('fccfmnewpwd')?.value;
    //const oldPasswordValue = control.get('fcoldpwd')?.value;
    debugger;

    if (passwordValue !== confirmPasswordValue) {
      return { passwordsMismatch: true }; // Error key
    }
    // if (passwordValue === oldPasswordValue) {
    //   return { passwordsSame: true }; // Error key
    // }
    return null;
  };
}
