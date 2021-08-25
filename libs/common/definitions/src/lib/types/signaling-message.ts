// export type SignalingMessage<T> = { id: string } & { [K in keyof T]: T };
export type SignalingMessage<T> = { id: string } & { data: T };
