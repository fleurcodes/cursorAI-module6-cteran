interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangePickerProps) {
  return (
    <fieldset className="flex flex-col sm:flex-row gap-3">
      <legend className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 sm:hidden">
        Date Range
      </legend>

      <div className="flex flex-col gap-1">
        <label htmlFor="analytics-start-date" className="text-xs font-medium text-gray-500 dark:text-gray-400">
          From
        </label>
        <input
          id="analytics-start-date"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          max={endDate || undefined}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
          aria-label="Start date"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="analytics-end-date" className="text-xs font-medium text-gray-500 dark:text-gray-400">
          To
        </label>
        <input
          id="analytics-end-date"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          min={startDate || undefined}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
          aria-label="End date"
        />
      </div>
    </fieldset>
  );
}
