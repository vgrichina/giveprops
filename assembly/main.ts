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

import { Props, allProps, propsByReceiver, propsBySender } from './model';

export function giveProps(receiverId: string, message: string): u64 {
  assert(receiverId.trim().length > 0, 'receiverId needs to be non-empty');
  assert(message.trim().length > 0, 'message needs to be non-empty');

  const sender = Context.sender;
  const props: Props = {
    sender,
    receiverId,
    message
  };

  const propsId = allProps.length;
  allProps.push(props);
  propsByReceiver.set(receiverId, propsId);
  propsBySender.set(sender, propsId);
  logging.log('Sent props from ' + sender + ' to ' + receiverId);

  return propsId;
}