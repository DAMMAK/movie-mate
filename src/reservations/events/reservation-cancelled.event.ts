export class ReservationCancelledEvent {
  constructor(
    public readonly reservationId: string,
    public readonly userId: string,
  ) {}
}
