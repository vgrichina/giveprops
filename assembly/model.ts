import { context, u128, PersistentVector, PersistentMap } from "near-sdk-as";

// TODO: Missed @nearBindgen should result in error when serializing
@nearBindgen
export class Props {
    sender: string;
    receiver: string;
    message: string;
    timestamp: u64;
}

export const allProps = new PersistentVector<Props>('props');

export function propsWithReceiver(receiver: string): PersistentVector<i32> {
    return new PersistentVector<i32>('propsWithReceiver/' + receiver);
}

export function propsWithSender(sender: string): PersistentVector<i32> {
    return new PersistentVector<i32>('propsWithSender/' + sender);
}