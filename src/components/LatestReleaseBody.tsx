import { latestRelease } from "@/data/latestRelease";

const LatestReleaseBody = () => (
  <div className="space-y-4">
    {latestRelease.blocks.map((block, index) => block.type === "heading" ? (
      <h3 key={index} className="pt-3 font-mono text-xs uppercase text-accent">{block.text}</h3>
    ) : (
      <p key={index} className="whitespace-pre-line text-[15px] leading-relaxed text-foreground/95 break-words">{block.text}</p>
    ))}
  </div>
);

export default LatestReleaseBody;
