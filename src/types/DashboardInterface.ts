export interface CheckoutTypeInterface {
  CheckoutType: string;
  CheckoutCount: number;
}

export interface CheckoutStatusInterface {
  CheckoutStatus: string;
  CheckoutCount: number;
}

export interface CheckoutOverviewInterface {
  CheckoutTypes: CheckoutTypeInterface[];
  CheckoutStatus: CheckoutStatusInterface[];
}

export interface CheckInOverviewInterface {
  CategoryName: string;
  CategoryQuantity: number;
}

export interface ProductDetailsInterface {
  InventoryStatus: string;
  InventoryCount: number;
}

export interface CategoryChartDataInterface {
  CategoryName: string;
  CategoryNameCount: number;
}

export interface TaskListInterface {
  TaskId: number;
  TaskSubject: string;
}

export interface DashboardDataInterface {
  CheckInOverview: CheckInOverviewInterface[];
  CheckoutOverview: CheckoutOverviewInterface;
  ProductDetails: ProductDetailsInterface[];
  CategoryChart: CategoryChartDataInterface[];
}
