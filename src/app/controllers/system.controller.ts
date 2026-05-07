import { Body, Controller, InternalServerErrorException, Post } from "@nestjs/common";
import { SystemService } from "../services/system.service";
import { BaseSearchDto } from "../dto/base-search.dto";
import { PaginationVm } from "../view-model/pagination.vm";

@Controller('system')
export class SystemController {
    constructor(
        private readonly systemService: SystemService
    ){}

    @Post('search')
    async search( @Body() body: BaseSearchDto ){
        try{
            const result = await this.systemService.search(body)
            const pagination = {
                page: Number(body.page),
                limit: Number(body.limit),
                totalItems: Number(result.totalItem)
            }
            return PaginationVm.convertToVm(result.data, pagination)
        }catch(err){
            throw new InternalServerErrorException(err.message)
        }
    }
}
