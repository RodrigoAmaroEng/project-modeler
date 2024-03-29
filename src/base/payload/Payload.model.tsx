import { Entity, Property } from "../entity/Entity.model";
import {
  BasicObjectWithDescription,
  FieldType,
  FieldSize,
  PropertyType,
  SourceType,
  DataTypes,
} from "../../extras/models";

export class PayloadProperty {
  static _meta: any = {
    name: "PayloadProperty",
    storeName: "entities.properties",
    validation: (item: any) =>
      item.kind === PropertyType.EntityProperty
        ? item.entityId && item.propertyId
        : item.name && item.type,
    uniquenessRule: (target: any, iter: any) =>
      target.kind === PropertyType.EntityProperty
        ? iter.entityId === target.entityId &&
          iter.propertyId === target.propertyId
        : iter.name === target.name,
    fields: {
      id: {
        type: FieldType.identifier,
      },
      kind: {
        placeholder: "What kind of property is it?",
        required: true,
        type: FieldType.radio,
        source: PropertyType,
        sourceType: SourceType.enumeration,
        size: FieldSize.full,
      },
      name: {
        placeholder: "Payload name",
        required: false,
        type: FieldType.input,
        size: FieldSize.half,
        conditionField: "kind",
        condition: PropertyType.Variable,
      },
      type: {
        placeholder: "Data type of this property",
        required: false,
        type: FieldType.dropdown,
        source: DataTypes,
        sourceType: SourceType.enumeration,
        size: FieldSize.half,
        conditionField: "kind",
        condition: PropertyType.Variable,
      },
      entityId: {
        placeholder: "Entity that ows the property",
        required: false,
        type: FieldType.dropdown,
        source: Entity,
        sourceType: SourceType.list,
        size: FieldSize.half,
        conditionField: "kind",
        condition: PropertyType.EntityProperty,
      },
      propertyId: {
        placeholder: "Entity property",
        required: false,
        type: FieldType.dropdown,
        source: Property,
        sourceType: SourceType.list,
        size: FieldSize.half,
        dependsOn: "entityId",
        conditionField: "kind",
        condition: PropertyType.EntityProperty,
      },
    },
  };

  id: number;
  kind: PropertyType;
  name?: string;
  type?: DataTypes;
  entityId?: number;
  propertyId?: number;
  constructor(
    id: number,
    kind: PropertyType,
    name: string,
    type: DataTypes,
    entityId?: number,
    propertyId?: number
  ) {
    this.id = id;
    this.kind = kind;
    this.entityId = entityId;
    this.propertyId = propertyId;
    this.name = name;
    this.type = type;
  }
}

export class Payload extends BasicObjectWithDescription {
  static _meta: any = {
    name: "Payload",
    storeName: "payloads",
    tag: "P",
    fields: {
      id: {
        type: FieldType.identifier,
      },
      name: {
        placeholder: "Payload name",
        required: true,
        type: FieldType.input,
        size: FieldSize.half,
      },
      description: {
        placeholder: "Payload description",
        required: false,
        type: FieldType.smartInput,
        size: FieldSize.full,
      },
      properties: {
        placeholder: "Properties for this entity",
        required: true,
        type: FieldType.list,
        kind: PayloadProperty,
        size: FieldSize.full,

        transform: (item: any) =>
          Object.assign(item, {
            entityId: item.entityId?.id ?? item.entityId,
            propertyId: item.propertyId?.id ?? item.propertyId,
          }),
      },
    },
  };
  properties: PayloadProperty[] = [];
  constructor(id: number, name: string, description?: string) {
    super(id, name, description);
  }
}
