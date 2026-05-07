import { HttpStatus } from "@nestjs/common"
import { IsNumber } from "class-validator"

export class PaginationInterface {
    page: number
    limit: number
    dataRows: any
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

    rows: any
    

    static convertToData({ page, limit, dataRows }: PaginationInterface): PaginationData {
        const rowsData = dataRows || []
        const totalItems = rowsData.length; // จำนวนข้อมูลทั้งหมด
        const totalPages = Math.ceil(totalItems / limit); // จำนวนหน้าทั้งหมด
        const startIndex = (page - 1) * limit; // ตำแหน่งเริ่มต้น
        const endIndex = startIndex + limit; // ตำแหน่งสิ้นสุด

        const paginatedData = rowsData.slice(startIndex, endIndex); // ตัดข้อมูลเฉพาะหน้านี้

        return {
            page: Number(page),
            limit: Number(limit),
            totalPages: totalPages,
            totalItems: totalItems,
            rows: paginatedData
        };
    }
}

export class PaginationManualVm {
    data: any
    paginationData: PaginationData
    static convertToVm( data:any, page: number, limit: number){
        // const result = data.map(({ DeletedDate, ...rest }) => rest); 
        const dataForConvert = {
            page: page,
            limit: limit,
            dataRows: data
        }
        const {rows, ...resultDataPagination} = PaginationData.convertToData(dataForConvert)
        const response = {
            statusCode: HttpStatus.OK,
            message: "OK",
            data: rows,
            paginationData: resultDataPagination
        }
        return response
    }
}