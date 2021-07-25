export type SignalingMessage<K, T> = { id: string } & { [K: string]: T };
