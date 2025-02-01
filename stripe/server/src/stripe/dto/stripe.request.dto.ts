import { IsString, IsNotEmpty, IsNumber, IsEmail, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class Product {
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'Name is required' })
    @IsString()
    name: string;

    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'Description is required' })
    @IsString()
    description: string;

    @IsNotEmpty({ message: 'Amount is required' })
    @Type(() => Number)
    @IsNumber()
    amount: number;

    @IsNotEmpty({ message: 'Quantity is required' })
    @Type(() => Number)
    @IsNumber()
    quantity: number;
}

export class Customer {
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail()
    email: string;
}

export class StripeRequestBody {
    @ValidateNested({ each: true })
    @Type(() => Product)
    product: Product[];

    @ValidateNested()
    @Type(() => Customer)
    customer: Customer;
}