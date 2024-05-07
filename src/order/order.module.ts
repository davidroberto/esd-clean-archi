import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrderRepository from './infrastructure/order.repository';
import OrderController from './presentation/order.controller';
import { CreateOrderService } from './domain/use-case/create-order.service';
import { OrderRepositoryInterface } from './domain/port/order.repository.interface';
import { Order } from './domain/entity/order.entity';
import { OrderItem } from './domain/entity/order-item.entity';
import { GetOrdersService } from './domain/use-case/get-orders.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrderController],
  providers: [
    {
      provide: 'OrderRepositoryInterface',
      useClass: OrderRepository,
    },
    {
      provide: CreateOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface, eventEmitter) => {
        return new CreateOrderService(orderRepository, eventEmitter);
      },
      inject: ['OrderRepositoryInterface', EventEmitter2],
    },

    {
      provide: GetOrdersService,
      useFactory: (orderRepository: OrderRepositoryInterface) => {
        return new GetOrdersService(orderRepository);
      },
      inject: ['OrderRepositoryInterface'],
    },
  ],
})
export class OrderModule {}
