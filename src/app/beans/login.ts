
export interface Login {
    userId: string;
    password: string;
    recaptchaResponse:string;
}

export interface ChangePassword {
    userId: string;
    oldPassword: string;
    newPassword: string;
    retypePaasword: string;
}
