const metrics = [
  { value: "C$0.13", label: "Current Price", serif: true },
  { value: "~C$15.98M", label: "Market Cap", serif: true },
  { value: "118.3M", label: "Shares Out", serif: false },
  { value: "6", label: "Product Lines", serif: false },
  { value: "CSE · FWB", label: "Dual Listed", serif: false },
];

const MetricsBar = () => {
  return (
    <div className="relative z-10 -mt-8 px-5">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-lg shadow-metrics p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          {metrics.map((metric, index) => (
            <div key={index} className="py-2">
              <h3
                className={`text-xl md:text-2xl font-bold text-primary ${
                  metric.serif ? "font-display-serif" : "font-mono"
                }`}
              >
                {metric.value}
              </h3>
              <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider mt-1 font-mono">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsBar;
