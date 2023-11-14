import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from 'src/app/shared/Models/order';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  order!: IOrder;

  constructor(private orderService: OrdersService, private breadcrumbService: BreadcrumbService,
              private route: ActivatedRoute) {
        breadcrumbService.set('@orderDetailed', ' ');
  }
  
  ngOnInit(): void {
    this.getOrder();
  }

  getOrder() {
    this.orderService.getOrderDetails(Number(this.route.snapshot.paramMap.get('id')))
        .subscribe((order: IOrder) => {
          this.order = order;
          this.breadcrumbService.set('@orderDetailed', `Order# ${order.id} = ${order.status}`);
        }, error => {
          console.log(error);
        })
  }
}
