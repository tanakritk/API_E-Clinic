import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { DropdownService } from '../services/dropdown.service';
import { ResponseOriginalDataVm } from '../view-model/response-original-data.vm';

@Controller('dropdown')
export class DropdownController {
  constructor(private readonly dropdownService: DropdownService) {}

  @Get('branch')
  async getBranch() {
    try {
      const result = await this.dropdownService.getBranch();
      return ResponseOriginalDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Get('user')
  async getUser() {
    try {
      const result = await this.dropdownService.getUser();
      return ResponseOriginalDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Get('product')
  async getProduct() {
    try {
      const result = await this.dropdownService.getProduct();
      return ResponseOriginalDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Get('courses')
  async getCourses() {
    try {
      const result = await this.dropdownService.getCourses();
      return ResponseOriginalDataVm.convertToVm(result);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
