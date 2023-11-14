import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/Models/basket';
import { IOrder } from 'src/app/shared/Models/order';
import { CheckoutService } from '../checkout.service';

declare var Stripe: (arg0: string) => any;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkoutForm!: FormGroup;

  @ViewChild('cardNumber', {static: true}) cardNumberElem!: ElementRef;
  @ViewChild('cardExpiry', {static: true}) cardExpiryElem!: ElementRef;
  @ViewChild('cardCvc', {static: true}) cardCvcElem!: ElementRef;

  stripe: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardError: any;
  loading = false;

  // card Elems Validation
  cardNumberValid = false;
  cardExpiryValid = false;
  cardCvcValid = false;

  cardHandler = this.onChange.bind(this);

  constructor(private basketService: BasketService,
       private checkoutService: CheckoutService,
       private toasterService: ToastrService,
       private router: Router) {}
       
  ngAfterViewInit(): void {
    this.stripe = Stripe('pk_test_51MhraUANAFuLOQ0GjS7XgFhJ2cKwm9sGpt3LdCdtRvQaxmLydqT50glZg0J3c72xDPtCyaXzlyi8yDxVNLbMC8cy00dIrzZMGM');
    const elements = this.stripe.elements();
    
    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElem.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);
    
    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElem.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);
    
    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElem.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);
  }
  
  ngOnDestroy(): void {
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }

  onChange(event:any) {
    console.log(event);
    if(event.error) {
      this.cardError = event.error.message;
    } else {
      this.cardError = null;
    }

    switch(event.elementType) {
      case 'cardNumber':
        this.cardNumberValid = event.complete;
        break; 
      case 'cardExpiry':
        this.cardExpiryValid = event.complete;
        break; 
      case 'cardCvc':
        this.cardCvcValid = event.complete;
        break; 
    }
  }

  async submitOrder() {
    this.loading = true;
    const basket = this.basketService.getCurrentBasketValue();

    try {
      const createdOrder = await this.createOrder(basket);
      const paymentResult = await this.confirmPaymentWithStripe(basket);
  
      if(paymentResult.paymentIntent) {
        this.basketService.deleteBasket(basket);
        const navigationExtras: NavigationExtras = {state: createdOrder};
        this.router.navigate(['checkout/success'], navigationExtras);
      } else {
        this.toasterService.error(paymentResult.error.message);
      }

      this.loading = false;

    } catch (error) {
      console.log(error);
      this.loading = false;
    }
  }

  private async confirmPaymentWithStripe(basket: IBasket) {
    return this.stripe.confirmCardPayment(basket.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.checkoutForm.get('paymentForm')?.get('nameOnCard')?.value
        }
      }
    });
  }

  private async createOrder(basket: IBasket) {
    const orderToCreate = this.getOrderToCreate(basket);
    return this.checkoutService.createOrder(orderToCreate).toPromise();
  }

  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm')?.get('deliveryMethod')?.value,
      shipToAddress: this.checkoutForm.get('addressForm')?.value
    }
  }
}

