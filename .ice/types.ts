import React from 'react';
import { IAppRouterProps } from './types/router';
import { ILogger } from './logger/types';
import { IRequest } from './request/types';
import { IStore } from './types/store';

export interface IApp {
  rootId?: string;
  mountNode?: HTMLElement;
  addProvider?: ({ children }: { children: React.ReactNode }) => React.ComponentType;
  getInitialData?: () => Promise<any>;
}


export interface IAppConfig {
app?: IApp
router?: IAppRouterProps;
logger?: ILogger;
request?: IRequest;
store?: IStore;
}

