import { Expose, Type } from 'class-transformer';
import { PresentationSubmission } from './Types';

export class Nested {
  @Expose({ name: 'presentation_submission' })
  @Type(() => PresentationSubmission)
  // @Transform(
  //   ({ value }) =>
  //     value
  //       ? instanceToPlain(value, { excludeExtraneousValues: true })
  //       : undefined,
  //   { toPlainOnly: true }
  // )
  presentationSubmission?: PresentationSubmission;

  constructor(presentationSubmission?: PresentationSubmission) {
    this.presentationSubmission = presentationSubmission;
  }
}
