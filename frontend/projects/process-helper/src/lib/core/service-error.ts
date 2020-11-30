export enum ServiceErrorCode {
  // user is not authenticated
  NOT_AUTHENTICATED,

  // user is not authorized to perform operaton
  NOT_AUTHORIZED,

  // the requested resource was not found
  NOT_FOUND,

  // the request is semantically valid, but the operation is not possible
  NOT_POSSIBLE,

  // any other error
  ERROR
}

export class ServiceError {
  constructor(
    public readonly errorCode: ServiceErrorCode
  ) {
  }
}
