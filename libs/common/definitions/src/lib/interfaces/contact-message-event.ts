export interface ContactMessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}
