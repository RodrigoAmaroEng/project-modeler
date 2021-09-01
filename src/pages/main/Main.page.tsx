import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import CRUD from "../../components/CRUD";
import Menu, { MenuItem } from "../../components/Menu";
import { Payload } from "../../base/payload/Payload.model";
import { Entity } from "../../base/entity/Entity.model";
import { Operation } from "../../base/operation/Operation.model";
import { Terminator } from "../../base/terminator/Terminator.model";
import { navigateTo, saveProject } from "./Main.actions";
import "./Main.page.css";
import { forModel } from "../../renderers/ForModel";
import { saveAndFinishWizard } from "../new-project/new-project.reducer";
import { GDriveApiInstance } from "../../extras/gdrive-api";
import { RecordList } from "../../extras/extension-functions";
import { findObject, searchObject } from "../../extras/models";

import {
  ConfigIcon,
  FindIcon,
  FolderIcon,
  HomeIcon,
  ReportIcon,
  SaveIcon,
} from "../../img/Icons";
import ModalWindow from "../../components/Modal";
import { Line } from "../../components/Utils";
import { MainButton, SecondaryButton } from "../../components/Button";
import { answerNo, answerYes } from "../../App.actions";
import ConfirmationBox from "../../components/ConfirmationBox";

export default function MainPage(props: any) {
  const dispatch = useDispatch();
  const content = useSelector((state: any) => state.project.content);
  const terminators = useSelector(
    (state: any) => state.project.content.terminators
  );
  const operations = useSelector(
    (state: any) => state.project.content.operations
  );
  const message = useSelector((state: any) => state.operation.message);
  const somethingToConfirm = useSelector(
    (state: any) => state.operation.waitingToConfirm
  );
  const entities = useSelector((state: any) =>
    RecordList.fromList(
      state.project.content.entities.map((it: any) => {
        return { ...it, type: "ET" };
      })
    )
  );
  const payloads = useSelector((state: any) => state.project.content.payloads);

  const onSearch = (search: string) => searchObject(content, search);
  const onQueryItem = (id: number, type: string) =>
    findObject(content, id, type);
  return (
    <div className="main-structure">
      <ConfirmationBox message={somethingToConfirm?.message}/>
      <header>
        <span aria-alt="Home">
          <HomeIcon />
        </span>
        <span aria-alt="Save">
          <SaveIcon
            onClick={() => dispatch(saveProject(GDriveApiInstance.upload))}
          />
        </span>
        <span aria-alt="Config">
          <ConfigIcon />
        </span>
        <span aria-alt="Search">
          <FindIcon />
        </span>
        <span aria-alt="Report">
          <ReportIcon />
        </span>
        <span aria-alt="Folder">
          <FolderIcon />
        </span>
        {message ? <div className="message">{message}</div> : ""}
      </header>
      <aside>
        <Menu onChange={(name: string) => dispatch(navigateTo(name))}>
          <MenuItem name="Terminators" count={terminators.length} />
          <MenuItem name="Operations" count={operations.length} />
          <MenuItem name="Entities" count={entities.length} />
          <MenuItem name="Payloads" count={payloads.length} />
        </Menu>
      </aside>
      <article>
        <Switch>
          <Route path="/project/stored/terminators">
            <CRUD
              items={terminators}
              object={Terminator}
              renderer={forModel}
              onSearch={onSearch}
              onQueryItem={onQueryItem}
            />
          </Route>
          <Route path="/project/stored/operations">
            <CRUD
              items={operations}
              object={Operation}
              renderer={forModel}
              onSearch={onSearch}
              onQueryItem={onQueryItem}
            />
          </Route>
          <Route path="/project/stored/entities">
            <CRUD
              items={entities}
              object={Entity}
              renderer={forModel}
              onSearch={onSearch}
              onQueryItem={onQueryItem}
            />
          </Route>
          <Route path="/project/stored/payloads">
            <CRUD
              items={payloads}
              object={Payload}
              renderer={forModel}
              onSearch={onSearch}
              onQueryItem={onQueryItem}
            />
          </Route>
          <Route path="/project/stored"></Route>
        </Switch>
      </article>
    </div>
  );
}
