import { HttpStatus } from '@nestjs/common';
export class ResponseAuthVm {
    data: any
    static convertToVm( token:string, profile?:any){
        const response = {
            statusCode: HttpStatus.OK,
            message: "OK",
            profile: profile,
            token: token,
        }
        return response
    }
}