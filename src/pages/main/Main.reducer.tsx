import { initialState } from "../../App.store";
import history from "../../navigation/history";

export default function mainReducer(
  state = initialState,
  action: any
) {
  switch (action.type) {
    case "menu/navigate-to": {
      history.push("/project/stored/" + action.payload);
      return state;
    }
    
    default: {
      return state;
    }
  }
}