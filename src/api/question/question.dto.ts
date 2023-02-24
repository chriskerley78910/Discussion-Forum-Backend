import { IsAlpha, IsBoolean, IsDefined, IsNotEmpty, IsString, IsUUID, isUUID, ValidationOptions} from 'class-validator'

export class CreateQuestionDto {


    @IsUUID()
    userId: string;

    @IsNotEmpty()
    @IsString()
    text: string;

  }

