import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeConfig } from './config/stripe.config';
import { Product, Customer } from './dto/stripe.request.dto';
import { StripeUrl } from './dto/stripe.response.dto';
import { Currency } from 'types';

const db: { [key: string]: any } = {};

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  constructor(private readonly stripeConfig: StripeConfig) {
    this.stripe = new Stripe(this.stripeConfig.values.secretkey, {
      apiVersion: this.stripeConfig.values.apiVersion,
      telemetry: this.stripeConfig.values.telemetry,
    });
  }

  async checkout(product: Product[], customer: Customer): Promise<StripeUrl> {
    const line_items = product.map((p) => ({
      price_data: {
        currency: this.stripeConfig.values.currency as Currency,
        product_data: {
          name: p.name,
          description: p.description,
        },
        unit_amount: p.amount * 100,
      },
      quantity: p.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      line_items,
      customer_email: customer.email,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['IN', 'US', 'GB', 'DE'],
      },
      expires_at:
        Math.floor(Date.now() / 1000) +
        (this.stripeConfig.values.exipry as number),
      mode: 'payment',
      success_url: `${this.stripeConfig.values.baseUrl}/success`,
      cancel_url: `${this.stripeConfig.values.baseUrl}/cancel`,
    });
    db[session.id] = {
      sessionId: session.id,
      customerEmail: customer.email,
      status: 'pending',
      createdAt: new Date(),
    };
    return { id: session.id };
  }

  constructEvent(payload: any, signature: any): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.stripeConfig.values.webhookSecret,
    );
  }

  getAllPaymentStatus(): any {
    return db;
  }

  getPaymentStatus(sessionId: string): any {
    return db[sessionId];
  }

  updatePaymentStatus(sessionId: string, status: string): void {
    console.log(status, sessionId);
    if (db[sessionId]) {
      db[sessionId].status = status;
    }
  }
}
