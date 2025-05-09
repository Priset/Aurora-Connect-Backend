import { IsEnum } from 'class-validator';
import { Status } from 'src/common/enums/status.enum';

export class UpdateRequestStatusDto {
  @IsEnum(Status, { message: 'Estado inválido' })
  status: Status;
}
