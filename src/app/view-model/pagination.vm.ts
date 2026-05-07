import { HttpStatus } from "@nestjs/common"
import { IsNumber } from "class-validator"

export class PaginationInterface {
    page: number
    limit: number
    totalItems: number
}
export class PaginationData {
    @IsNumber()
    page: number

    @IsNumber()
    limit: number

    @IsNumber()
    totalPages: number

    @IsNumber()
    totalItems: number

    static convertToData(pagination: PaginationInterface): PaginationData {
        const result : PaginationData = {
            page: pagination.page,
            limit: pagination.limit,
            totalPages: Math.ceil(pagination.totalItems / (pagination.limit || 1)),
            totalItems: pagination.totalItems,
        }
        return result
    }
}

export class PaginationVm {
    data: any
    paginationData: PaginationData
    static convertToVm( data:any, paginationItem: PaginationInterface ){
        // const result = data.map(({ DeletedDate, ...rest }) => rest); 
        const result = data.map((item, index) => {
            const { DeletedDate, ...rest } = item
            const noStart = (paginationItem.page - 1) * paginationItem.limit + 1;
            return {
                ...rest,
                no: noStart + index
            }
        })
        const response = {
            statusCode: HttpStatus.OK,
            message: "OK",
            data: result,
            paginationData: PaginationData.convertToData(paginationItem)
        }
        return response
    }
}