const Tooltip: React.FC<{
  label: string;
  value: number;
  x: number;
  y: number;
  visible: boolean;
}> = ({ label, value, x, y, visible }) => {
  if (!visible) return null; // Don't render the tooltip if not visible

  return (
    <div
      className={`absolute left-[${x.toString()}px] top-[${y.toString()}px] bg-surface border-2 border-primary px-1 py-2 rounded-lg z-50 pointer-events-none hidden md:block`}
    >
      <strong>{label}</strong>: {value}
    </div>
  );
};

export default Tooltip;
