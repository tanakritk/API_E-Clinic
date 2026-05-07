import { HttpStatus } from '@nestjs/common';
export class ResponseDataVm {
    data: any
    static convertToVm( data:any){
        // const {DeletedDate, ...result} = data
        // const response = {
        //     statusCode: HttpStatus.OK,
        //     message: "OK",
        //     data: result
        // }
        // return response
        if( data !== null ){
            const { DeletedDate, ...result } = data
            const response = {
                statusCode: HttpStatus.OK,
                message: "OK",
                data: result
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