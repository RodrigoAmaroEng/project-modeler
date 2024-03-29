import { gapi } from "gapi-script";
import { FOLDER_MIME_TYPE } from "./models";

// Client ID and API key from the Developer Console
const CLIENT_ID = process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY;

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = [
  "https://www.googleapis.com/auth/drive.appdata",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.install"
];

export class GoogleUser {
  name: string;
  email: string;
  picture: string;
  id: string;

  constructor(id: string, name: string, email: string, picture: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.picture = picture;
  }
  static i(gapiUser: any): GoogleUser {
    return new GoogleUser(
      gapiUser.NT.toString(),
      gapiUser.Ad.toString(),
      gapiUser.cu.toString(),
      gapiUser.hK.toString()
    );
  }
}
const compareName = (a: any, b: any) => (a.name < b.name ? -1 : 1);
const sortByFilename = (a: any, b: any) => {
  if (a.mimeType === FOLDER_MIME_TYPE) {
    if (b.mimeType === FOLDER_MIME_TYPE) {
      return compareName(a, b);
    } else {
      return -1;
    }
  } else {
    if (b.mimeType === FOLDER_MIME_TYPE) {
      return 1;
    } else {
      return compareName(a, b);
    }
  }
};

class GDriveApi {
  callbacks: any[];
  isInitialized: boolean;
  isSignedIn: boolean;
  user: any;
  constructor() {
    this.callbacks = [];
    this.isInitialized = false;
    this.isSignedIn = false;
    this.user = null;
    this.initialize = this.initialize.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onUpdateStatus = this.onUpdateStatus.bind(this);
    this.registerListener = this.registerListener.bind(this);
    this.removeListener = this.removeListener.bind(this);
    this.listFiles = this.listFiles.bind(this);
    this.listFolders = this.listFolders.bind(this);
    this.list = this.list.bind(this);
  }

  initialize() {
    gapi.load("client:auth2", this.onLoad);
  }

  onUpdateStatus(isSignedIn: any) {
    this.isSignedIn = !!isSignedIn;
    if (this.isSignedIn) {
      this.user = gapi.auth2.getAuthInstance().currentUser.le.wt;
    }
    this.callbacks.forEach((c) => this.fireCallback(c));
  }

  onLoad() {
    gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES.join(" "),
      })
      .then(() => {
        this.isInitialized = true;
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.onUpdateStatus);
        this.onUpdateStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      })
      .catch((e: any) => {
        this.onUpdateStatus(false);
      });
  }

  signIn() {
    gapi.auth2.getAuthInstance().signIn();
  }
  signOut() {
    gapi.auth2.getAuthInstance().signOut();
  }

  listFolders(currentFolder: string = "root") {
    return this.list({
      pageSize: 10,
      fields: "nextPageToken, files(id, name, mimeType)",
      q: `trashed = false and '${currentFolder}' in parents and mimeType = '${FOLDER_MIME_TYPE}'`,
    });
  }

  listFiles(currentFolder: string = "root") {
    return this.list({
      pageSize: 10,
      fields: "nextPageToken, files(id, name, mimeType, modifiedTime)",
      q: `trashed = false and '${currentFolder}' in parents and (name contains '.uml.json' or mimeType = '${FOLDER_MIME_TYPE}')`,
    });
  }

  list(setup: any, pageToken?: string) {
    return gapi.client.drive?.files
      .list(Object.assign(setup, { pageToken }))
      .then((response: any) => JSON.parse(response.body))
      .then((response: any) => {
        if (response.nextPageToken) {
          return this.list(setup, response.nextPageToken).then(
            (nextResponse: any) => nextResponse.concat(response.files)
          );
        } else {
          return response.files;
        }
      })
      .then((files: any) => files.sort(sortByFilename));
  }

  download(fileId: string) {
    return gapi.client.drive.files.get({ fileId, alt: "media" });
  }

  upload(
    fileName: string,
    fileContent: string,
    fileId: string,
    folderId: string = "root"
  ) {
    var file = new Blob([fileContent], { type: "application/json" });
    var metadata = {
      name: fileName.replace(/\s/g, "-") + ".uml.json", // Filename at Google Drive
      mimeType: "application/json", // mimeType at Google Drive
    };
    if (!fileId) {
      metadata = Object.assign(metadata, { parents: [folderId] });
    }

    var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
    var form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("file", file);

    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      let updatePatchUrl = fileId ? `/${fileId}` : "";
      let url = `https://www.googleapis.com/upload/drive/v3/files${updatePatchUrl}?uploadType=multipart&fields=id,name`;
      let method = fileId ? "PATCH" : "post";
      xhr.open(method, url);
      xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
      xhr.responseType = "json";
      xhr.onload = () => {
        resolve(xhr.response); // Retrieve uploaded file ID.
      };
      xhr.onerror = (e) => reject(e);
      xhr.send(form);
    });
  }

  fireCallback(callback: (arg: any) => void) {
    callback({
      isInitialized: this.isInitialized,
      isSignedIn: this.isSignedIn,
      user: this.isSignedIn ? GoogleUser.i(this.user) : null,
    });
  }

  registerListener(callback: (arg: any) => void) {
    this.fireCallback(callback);
    this.callbacks.push(callback);
  }
  removeListener(callback: (arg: any) => void) {
    const index = this.callbacks.indexOf(callback);
    if (index >= 0) {
      this.callbacks = this.callbacks.slice(index, 1);
    }
  }
}

export const GDriveApiInstance = new GDriveApi();
