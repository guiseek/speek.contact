import { DataEventMap } from './data-event-map';
import { DataEvent } from './data-event';
import { Callback } from './callback';

export type DataEventCallback<K extends DataEvent = DataEvent> = Map<
  K,
  Callback<DataEventMap[K]>
>;
