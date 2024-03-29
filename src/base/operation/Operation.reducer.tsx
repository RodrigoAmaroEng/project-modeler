import {
  addToList,
  buildErrorMessage,
  includeSimpleRegistry,
  removeFromList,
} from "../../extras/crud-operations";
import { RecordList } from "../../extras/extension-functions";
import history from "../../navigation/history";

const identifyPayload = (name: string, payloads: RecordList) => {
  let existingPayload = payloads.find((it: any) => it.name === name);
  if (!existingPayload) {
    payloads = addToList(payloads, { name });
  }
  return [existingPayload?.id ?? payloads[payloads.length - 1].id, payloads];
};

export default function operationReducer(state: any, action: any) {
  switch (action.type) {
    case "crud/add-operation": {
      let item = action.payload;
      const validation = (item: any) =>
        item.name && item.terminator && item.direction;
      try {
        state.project.content.operations = includeSimpleRegistry(
          state.project.content.operations,
          item,
          validation
        );
        state.operation.clearFields = true;
      } catch (e: any) {
        state.operation.error = buildErrorMessage(e, item.name, "Operation");
      }
      return state;
    }
    case "crud/remove-operation": {
      state.project.content.operations = removeFromList(
        state.project.content.operations,
        action.payload
      );
      return state;
    }
    case "new-project/finish-operation": {
      if (state.project.content.operations.length > 0) {
        history.push(
          "/project/new/operations/" + state.project.content.operations[0].id
        );
      } else {
        state.operation.error = "You need to add at least one Operation";
      }
      return state;
    }
    case "new-project/save-operation-details": {
      if (!action.payload.trigger) {
        state.operation.error =
          "You need to specify what triggers this operation.";
        return state;
      }
      if (!action.payload.inputPayload) {
        state.operation.error = "You need to name at least the input payload.";
        return state;
      }
      let operations = RecordList.fromList([
        ...state.project.content.operations,
      ]);
      let item = operations.byId(action.payload.id);
      item = Object.assign(item, action.payload);
      let index = operations.findIndex((it) => it.id === action.payload.id);
      if (item.inputPayload) {
        let result = identifyPayload(
          item.inputPayload,
          RecordList.fromList(state.project.content.payloads)
        );
        state.project.content.payloads = result[1]
        item.inputPayload = result[0];
        
      }
      if (item.outputPayload) {
        let result = identifyPayload(
          item.outputPayload,
          RecordList.fromList(state.project.content.payloads)
        );
        state.project.content.payloads = result[1]
        item.outputPayload = result[0];
      }
      state.project.content.operations[index] = item;

      state.operation.clearFields = true;
      if (index + 1 == operations.length) history.push("/project/new/4");
      else history.push("/project/new/operations/" + operations[index + 1].id);
      return state;
    }
    default: {
      return state;
    }
  }
}
