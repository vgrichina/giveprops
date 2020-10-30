import { context, u128, PersistentVector, PersistentMap } from "near-sdk-as";

export class Props {
    sender: string;
    receiverId: string;
    message: string;
}

export const allProps = new PersistentVector<Props>('props');
export const propsByReceiver = new PersistentMap<string, u64>('propsByReceiver');
export const propsBySender = new PersistentMap<string, u64>('propsBySender');
