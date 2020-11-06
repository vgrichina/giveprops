/*
 * This is an example of an AssemblyScript smart contract with two simple,
 * symmetric functions:
 *
 * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
 *    user (account_id) who sent the request
 * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
 *    defaulting to "Hello"
 *
 * Learn more about writing NEAR smart contracts with AssemblyScript:
 * https://docs.near.org/docs/roles/developer/contracts/assemblyscript
 *
 */

import { Context, logging, storage } from "near-sdk-as";
import { Props, allProps, propsWithReceiver, propsWithSender, Props } from './model';

export function giveProps(receiver: string, message: string): u64 {
  assert(receiver.trim().length > 0, 'receiver needs to be non-empty');
  assert(message.trim().length > 0, 'message needs to be non-empty');

  const sender = Context.sender;
  const timestamp = Context.blockTimestamp;
  const props: Props = {
    sender,
    receiver,
    message,
    timestamp
  };

  const propsId = allProps.push(props);
  propsWithReceiver(receiver).push(propsId);
  propsWithSender(sender).push(propsId);
  logging.log('Sent props from ' + sender + ' to ' + receiver);

  return propsId;
}

export function getRecentProps(): Props[] {
  const limit = 10;
  let offset = allProps.length - limit;
  if (offset < 0) {
    offset = 0;
  }
  let result: Props[] = [];
  for (let i = 0; i < limit && i + offset < allProps.length; i++) {
    result.push(allProps[i + offset]);
  }
  return result;
}

export function getPropsWithReceiver(receiver: string): Props[] {
  const propsIds = propsWithReceiver(receiver)

  const limit = 10;
  let offset = propsIds.length - limit;
  if (offset < 0) {
    offset = 0;
  }
  let result: Props[] = [];
  for (let i = 0; i < limit && i + offset < propsIds.length; i++) {
    result.push(allProps[propsIds[i + offset]]);
  }
  return result;
}