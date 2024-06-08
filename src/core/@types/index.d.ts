// types.ts
export interface DIProps {
  di: {
    GET: (url: string, params?: any, fullURl?: boolean, token?: any, headers?: any) => Promise<any>;
    POST: (url: string, data?: any, fullURl?: boolean, token?: any, headers?: any, anonymous?: boolean) => Promise<any>;
    PUT: (url: string, data?: any, fullURl?: boolean, token?: any) => Promise<any>;
    DELETE: (url: string, data?: any, fullURl?: boolean, token?: any) => Promise<any>;
    PUSH: (path: any, data?: any) => void;
    PARAMS: any;
  };

  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  redux: ReduxMethods;
  user: UserMethods;
  location: any;
  globalState: GlobalState;
  environment: Enviroment;
}

export interface ReduxMethods {
  set: (stateKey: string, data: any,) => void;
  get: (stateKey: string) => any;
  state: any
}

export interface UserMethods {
  get: (statekey: any) => any;
  set: (data: any) => void;
}

export interface GlobalState {
  get: (key: string) => string | null;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
  getBearerToken: () => string | null;
}

export interface Enviroment {
  app_name: string,
  API_END_POINT: string,
  bearer: string,
}