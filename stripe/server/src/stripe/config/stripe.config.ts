import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeConfig {
    private readonly stripeConfig: ConfigService;
    constructor(stripeConfig: ConfigService) {
        this.stripeConfig = stripeConfig;
    }


    get values() {
        return {
            secretkey: this.stripeConfig.get('STRIPE_SECRET_KEY'),
            apiVersion: this.stripeConfig.get('STRIPE_API_VERSION'),
            webhookSecret: this.stripeConfig.get('STRIPE_WEBHOOK_SECRET'),
            baseUrl: this.stripeConfig.get('CLIENT_BASE_URL'),
            telemetry: false,
            currency: 'inr',
            mode: 'payment',
            exipry: 60 * 30,
        }
    }
}