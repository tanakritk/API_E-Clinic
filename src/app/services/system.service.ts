import { Injectable } from '@nestjs/common';
import { SystemRepo } from '../repositories/system.repo';
import { BaseSearchDto } from '../dto/base-search.dto';

@Injectable()
export class SystemService {
  constructor(private readonly systemRepo: SystemRepo) {}

  async search(body: BaseSearchDto) {
    return await this.systemRepo.findData(body);
  }

  // Add basic CRUD if needed in future, but user only asked for search for now.
}
