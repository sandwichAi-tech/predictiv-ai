const metrics = [
  { value: "$0.09", label: "Current Price" },
  { value: "~$9.95M", label: "Market Cap" },
  { value: "120.6M", label: "Shares Out" },
  { value: "70%", label: "Insider Own" },
  { value: "4", label: "Divisions" },
];

const MetricsBar = () => {
  return (
    <div className="relative z-10 -mt-8 px-5">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-lg shadow-metrics p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          {metrics.map((metric, index) => (
            <div key={index} className="py-2">
              <h3 className="text-xl md:text-2xl font-bold text-primary font-mono">
                {metric.value}
              </h3>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
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
