import { BasicObjectWithDescription, FieldType, FieldSize } from "../../extras/models";


export class Terminator extends BasicObjectWithDescription {
  static _meta: any = {
    name: "Terminator",
    storeName: "terminators",
    tag: "T",
    validation: undefined,
    fields: {
      id: {
        type: FieldType.identifier,
      },
      name: {
        placeholder: "Terminator name",
        required: true,
        type: FieldType.input,
        size: FieldSize.half,
      },
      description: {
        placeholder: "Terminator description",
        required: false,
        type: FieldType.smartInput,
        size: FieldSize.full,
      },
    },
  };;
  constructor(id: number, name: string, description?: string) {
    super(id, name, description);
  }
}
