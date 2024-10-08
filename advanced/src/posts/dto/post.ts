import { IsNumber, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content: string;
}

export class UpdatePostDto extends CreatePostDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Post Id is required' })
  id: number;
}

export class DeletePostDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Id is required' })
  id: number;
}
