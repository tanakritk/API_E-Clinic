import { Controller, Get } from "@nestjs/common";

@Controller('test')
export class TestController {
    @Get('')
    async getVersion(){
        return 'AIP Strategy<br/>version 28.04.25.01'
    }
}