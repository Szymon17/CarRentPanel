export type OrderEntity = {
  id: number;
  carId: number;
  userId: number;
  dateOfReceipt: null | string;
  dateOfReturn: string;
  placeOfReceipt: string;
  placeOfReturn: string;
  paymentMethodId: number;
  statusId: number;
  addDate: string;
};
