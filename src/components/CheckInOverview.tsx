import { CheckInOverviewInterface } from "@/types/DashboardInterface";

const CheckInOverview = ({
  checkInOverviewData,
}: {
  checkInOverviewData: CheckInOverviewInterface[];
}) => {
  const colors = [
    "primary",
    "success",
    "lime-500",
    "yellow-500",
    "orange-500",
    "error",
  ];
  return (
    <div className="check-in-overview bg-surface rounded-xl p-4 flex flex-col text-center w-full drop-shadow-md text-sm h-full">
      <div className="title mb-2">
        <h1 className="font-bold text-lg">Weekly Check-in Overview</h1>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {checkInOverviewData?.map((category, idx) => (
          <div
            key={category.CategoryName}
            className="flex flex-col items-center bg-background rounded-xl w-full gap-2 p-2"
          >
            <span
              className={`icon-container flex justify-center items-center text-xl font-black text-${colors[idx]}`}
            >
              {idx === 0 ? "All" : idx}
            </span>
            <div className="flex-1 txt">
              <h3 className="title font-bold">{category.CategoryName}</h3>
              <p className="qty text-sm">
                Quantity: {category.CategoryQuantity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckInOverview;
