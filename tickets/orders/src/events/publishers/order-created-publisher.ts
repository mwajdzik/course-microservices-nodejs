import {OrderCreatedEvent, Publisher, Subjects} from '@mwtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
}
