import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IOrder } from 'src/app/shared/Models/order';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss']
})
export class CheckoutSuccessComponent {
  
  order!: IOrder;
  
  constructor(private router: Router) {
    const navigation = router.getCurrentNavigation();
    const state = navigation?.extras?.state;
    if(state) {
      this.order = state as IOrder;
    }
  }
}
