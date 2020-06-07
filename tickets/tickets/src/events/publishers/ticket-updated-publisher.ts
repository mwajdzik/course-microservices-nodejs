import {Publisher, Subjects, TicketUpdatedEvent} from "@mwtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {

    readonly subject: Subjects.TICKET_UPDATED = Subjects.TICKET_UPDATED;
}
