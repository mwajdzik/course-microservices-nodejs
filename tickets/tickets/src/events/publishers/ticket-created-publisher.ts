import {Publisher, Subjects, TicketCreatedEvent} from "@mwtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {

    readonly subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;
}
