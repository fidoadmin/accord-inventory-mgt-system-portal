export interface BulkCheckinItem {
  BarCode: string;
  SerialNumber: string | null;
}

export interface BulkCheckinInterface {
  Id: string;
  BulkCheckin: BulkCheckinItem[];
}
