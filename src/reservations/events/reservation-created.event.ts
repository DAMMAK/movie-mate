export class ReservationCreatedEvent {
  constructor(
    public readonly reservationId: string,
    public readonly userId: string,
    public readonly showtimeId: string,
  ) {}
}
