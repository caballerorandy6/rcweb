export class GoogleReviewsApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "GoogleReviewsApiError";
  }
}
