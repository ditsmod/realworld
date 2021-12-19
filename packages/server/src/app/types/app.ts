import { InjectionToken } from '@ts-stack/di';
import { edk, NodeRequest, NodeResponse } from '@ditsmod/core';

export interface LocalMap {
  [key: number]: string;
}

export const SessionToken = new InjectionToken<(req: NodeRequest, res: NodeResponse, next?: (...arg: any) => void) => void>('SessionToken');

export interface SessionMethods {
  reset(): void;
  setDuration(newDuration: number, ephemeral: boolean): void;
}
export type SessionObj<T extends edk.AnyObj = edk.AnyObj> = T & SessionMethods;
export interface QueryParams {
  [key: string]: string;
}

export interface AuthorshipData {
  userName: string;
  pubId: string;
}
