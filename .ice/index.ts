import helpers from './helpers';
import logger from './logger';
import request from './request/request';
import useRequest from './request/useRequest';
import store from './appModels';

export * from './components';
export * from './createApp';
export * from './types';

export const APP_MODE = (typeof window !== 'undefined' && window.__app_mode__) || process.env.APP_MODE;

export function lazy(dynamicImport) {
  return {
    '__LAZY__': true,
    dynamicImport
  };
}


export {
helpers,
logger,
request,
useRequest,
store,
}

