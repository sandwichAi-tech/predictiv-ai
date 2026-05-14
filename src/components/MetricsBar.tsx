const metrics = [
  { value: "C$0.13", label: "Current Price" },
  { value: "~C$15.98M", label: "Market Cap" },
  { value: "118.3M", label: "Shares Out" },
  { value: "+651%", label: "Rev YoY" },
  { value: "6", label: "Product Lines" },
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
