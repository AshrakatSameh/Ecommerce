import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/Models/basket';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.scss']
})
export class CheckoutReviewComponent implements OnInit {

  basket$!: Observable<IBasket>;

  @Input() appStepper!: CdkStepper;

  constructor(private basketSerivce: BasketService, private toasterService: ToastrService) {}
  
  ngOnInit(): void {
    this.basket$ = this.basketSerivce.basket$;
  }

  createPaymentIntent() {
    return this.basketSerivce.createPaymentIntent().subscribe((response: any) => {
      this.appStepper.next();
    }, error => {
      console.log(error);
    });
  }
  
}
