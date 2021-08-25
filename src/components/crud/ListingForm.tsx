import { useState } from "react";
import { SquareMainButton } from "../Button";
import Field from "../Field";
import List, { Action, IfEmpty, ListStyle, Row } from "../List";
import { Line, SpaceFill, SpaceV } from "../Utils";
import { useDispatch } from "react-redux";
import { deleteRecord, editRecord } from "../../pages/main/Main.actions";
import { Record } from "../../extras/extension-functions";
import { AddIcon, EditIcon, RemoveIcon } from "../../img/Icons";
import history from "../../navigation/history";

export default function ListingForm(props: any) {
  const dispatch = useDispatch();

  const [query, setQuery] = useState(undefined);

  const onAdd = () => {
    history.push(window.location.pathname + "/new");
  };
  const onEdit = (item: Record) => dispatch(editRecord(item.id));
  const onDelete = (item: Record) =>
    dispatch(deleteRecord(props.object.name, item));
  return (
    <div className="form-listing">
      <Line className="form-actions">
        <Field
          placeholder={`Type the name of the ${props.object.name} you're searching for`}
          className="half"
          onChange={setQuery}
        />
        <SpaceFill />
        <SquareMainButton onClick={onAdd}>
          <AddIcon />
        </SquareMainButton>
      </Line>
      <SpaceV />

      <div className="form-list">
        <List listStyle={ListStyle.Normal} className="fill-space">
          <IfEmpty>No {props.object.name} is registered.</IfEmpty>
          <Action>
            <SquareMainButton onClick={onEdit}>
              <EditIcon />
            </SquareMainButton>
          </Action>
          <Action>
            <SquareMainButton onClick={onDelete}>
              <RemoveIcon />
            </SquareMainButton>
          </Action>
          {props.items
            .filter(
              (item: any) =>
                !query ||
                item.name.toLowerCase().indexOf(query ?? "".toLowerCase()) > -1
            )
            .map((item: any, index: number) => (
              <Row item={item} key={`row-${index}`}>
                {props.renderer(props.object, item)}
              </Row>
            ))}
        </List>
      </div>
    </div>
  );
}
