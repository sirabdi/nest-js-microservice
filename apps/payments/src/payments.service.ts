import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charged.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!stripeSecretKey) {
      throw new Error(
        'STRIPE_SECRET_KEY is not defined in environment variables.',
      );
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-05-28.basil',
    });
  }

  async createCharge({ amount }: CreateChargeDto) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        confirm: true,
        currency: 'usd',
        amount: amount * 100,
        payment_method: 'pm_card_visa',
        automatic_payment_methods: {
          // Re-enable automatic methods
          enabled: true,
          // But explicitly forbid redirects
          allow_redirects: 'never',
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error creating Stripe Payment Intent:', error);
      // Re-throw the error for centralized error handling
      throw error;
    }
  }
}
