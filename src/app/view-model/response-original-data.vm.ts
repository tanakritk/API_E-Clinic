import { HttpStatus } from '@nestjs/common';
export class ResponseOriginalDataVm {
    data: any
    static convertToVm( data:any){
        if( data !== null ){
            const response = {
                statusCode: HttpStatus.OK,
                message: "OK",
                data: data
            }
            return response
        }

        return {
            statusCode: HttpStatus.NO_CONTENT,
            message: "No Data",
            data: data
        }
    }
}