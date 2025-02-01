import { Controller, Get, Post, Body, Req, BadRequestException, Param } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';
import { StripeRequestBody } from './dto/stripe.request.dto';
import { StripeUrl } from './dto/stripe.response.dto';
import { Request } from 'express';

@Controller('api')
export class StripeController {
    private readonly stripeService: StripeService;
    constructor(stripeService: StripeService) {
        this.stripeService = stripeService;
    }

    @Get('/status')
    async getAllStatus() {
        return this.stripeService.getAllPaymentStatus();
    }

    @Get('/status/:id')
    async getStatus(@Param('id') id: string) {
        return this.stripeService.getPaymentStatus(id)
    }

    @Post('/checkout')
    async createCheckoutSession(@Body() data: StripeRequestBody): Promise<StripeUrl> {
        const { product, customer } = data;
        return await this.stripeService.checkout(product, customer);
    }

    @Post('/webhook')
    async stripeWebhook(@Req() req: Request) {
        const signature = req.headers['stripe-signature'];
        let event: Stripe.Event;
        try {
            event = this.stripeService.constructEvent(req.body, signature);
        } catch (err) {
            console.log(err);
            throw new BadRequestException('Webhook signature verification failed.');
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            this.stripeService.updatePaymentStatus(session.id, session.payment_status);
        }
    }

}
