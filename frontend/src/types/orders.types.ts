export type UserSummary = {
  id: number;
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
};

export type OrderWithCarView = {
  id: number;
  userId: number;
  dateOfReceipt: null | string;
  dateOfReturn: null | string;
  placeOfReceipt: string;
  placeOfReturn: string;
  paymentMethodId: number;
  statusId: number;
  addDate: string;
  expectedReturnDate: string;
  carBrand: string;
  carImageUrl: string;
  carModel: string;
  statusName: string;
  user: UserSummary | null;
};

export type StatusEntity = {
  id: number;
  name: string;
  closed: boolean;
};

export type LocalizationEntity = {
  id: number;
  localization: string;
};

export type PaymentMethodEntity = {
  id: number;
  name: string;
  isActive: boolean;
};

export type OrderFormEntity = {
  id: number;
  carId: number | undefined;
  userId: number | undefined;
  dateOfReceipt: string;
  dateOfReturn: string;
  placeOfReceipt: string;
  placeOfReturn: string;
  paymentMethodId: number | undefined;
  statusId: number | undefined;
  addDate: string;
  expectedReturnDate: string;
};
