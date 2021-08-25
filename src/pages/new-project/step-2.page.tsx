import Button, { ButtonType } from "../../components/Button";
import Field from "../../components/Field";
import List, {
  Action,
  IfEmpty,
  ListStyle,
  Row,
} from "../../components/List";
import { Line, SpaceFill, SpaceH, SpaceV } from "../../components/Utils";
import { useDispatch, useSelector } from "react-redux";
import {
  goToOperationDetails,
} from "./new-project.actions";
import { useState } from "react";
import Circle from "../../components/Circle";
import { Radio, RadioGroup } from "../../components/Radio";
import DropDown, { Option, RenderList } from "../../components/DropDown";
import { RecordList } from "../../extras/extension-functions";
import StaticField from "../../components/StaticField";
import WizardNavigationControl from "./WizardNavigationControl";
import { useEffect } from "react";
import { fieldsClear } from "../../App.actions";
import { AddIcon, OperationIcon, RemoveIcon } from "../../img/Icons";
import { addOperation, removeOperation } from "../../base/operation/Operation.actions";

export default function Step2Page(props: any) {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [terminatorRef, setTerminatorRef] = useState(undefined);
  const [direction, setDirection] = useState(undefined as any);

  const operations = useSelector((state: any) =>
    RecordList.fromList(state.project.content.operations)
  );
  const terminators = useSelector((state: any) =>
    RecordList.fromList(state.project.content.terminators)
  );
  const error = useSelector((state: any) => state.operation.error);
  const shouldClearFields = useSelector(
    (state: any) => state.operation.clearFields
  );

  useEffect(() => {
    if (shouldClearFields) {
      setName("");
      setTerminatorRef(undefined);
      setDirection(undefined);
      dispatch(fieldsClear());
    }
  }, [shouldClearFields]);

  const add = () => dispatch(addOperation(name, terminatorRef, direction));
  const remove = (e: any) => dispatch(removeOperation(e));
  const nextAction = () => goToOperationDetails();

  return (
    <div className="fill-space flex-col">
      <h1>Step 2 - Operations</h1>
      <Line>
        <Field
          value={name}
          placeholder="Operation name"
          className="one-third"
          onChange={setName}
        />
        <SpaceH />
        <DropDown
          onSelect={setTerminatorRef}
          onRender={(item: any) => item.name}
          selected={terminatorRef}
          className="one-third"
        >
          <RenderList items={terminators} displayProperty="name" />
        </DropDown>
        <SpaceH />
        <RadioGroup onSelect={setDirection} selected={direction}>
          <Radio title="Input" value="IN" />
          <Radio title="Output" value="OUT" />
        </RadioGroup>
        <SpaceH />
        <SpaceFill />
        <Button type={ButtonType.main} className="square" onClick={add}>
          <AddIcon />
        </Button>
      </Line>
      <SpaceV />
      <List listStyle={ListStyle.Normal} className="fill-space">
        <IfEmpty>Add your first operation to see it here</IfEmpty>
        <Action>
          <Button type={ButtonType.main} onClick={remove} className="square">
            <RemoveIcon />
          </Button>
        </Action>
        {operations.map((item: any, index: number) => (
          <Row item={item} key={index}>
            <Circle>
              <OperationIcon />
            </Circle>
            <SpaceH />
            <StaticField
              className="fill-space"
              label="Operation name"
              value={item.name}
            />
            <SpaceH />
            <StaticField
              className="one-fourth"
              label="Terminator starter/destiny"
              value={terminators.byId(item.terminator).name}
            />
            <SpaceH />
            <StaticField
              className="one-twenty"
              label="Direction"
              value={item.direction}
            />
            <SpaceH />
          </Row>
        ))}
      </List>
      <SpaceV />
      <WizardNavigationControl error={error} nextAction={nextAction} />
    </div>
  );
}