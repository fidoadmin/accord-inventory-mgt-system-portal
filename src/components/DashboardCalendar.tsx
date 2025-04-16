import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DashboardCalendar = () => {
  return (
    <div className="calendar w-full">
      <Calendar
        calendarType="gregory"
        className={`rounded-xl !w-full !border-none !bg-background drop-shadow-md !text-sm`}
      />
    </div>
  );
};
export default DashboardCalendar;
