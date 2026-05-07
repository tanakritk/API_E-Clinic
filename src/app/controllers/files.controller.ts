import { Body, Controller, HttpStatus, InternalServerErrorException, Post } from "@nestjs/common";
import { GetSftpBody } from "../dto/sftp.dto";
import { FilesService } from "../services/files.service";

@Controller('files')

export class FilesController {
    constructor(
        private readonly filesService: FilesService
    ){}

    @Post('getfile')
    async getfile(@Body() body: GetSftpBody){
        try{
            const result = await this.filesService.downloadFileAsBase64AndType(body.path)
            return {
                statusCode: HttpStatus.OK,
                message: "OK",
                data: result
            }
            // return ResponseDataVm.convertToVm({result})
        }catch(err){
            throw new InternalServerErrorException(err.message)
        }
    }
}