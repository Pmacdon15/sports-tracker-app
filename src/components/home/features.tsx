import { Activity, Box, Lock, RefreshCw } from "lucide-react";

const featureData = [
  {
    icon: Activity,
    title: "Live Tracking",
    description: "Know exactly who has what, and when it is due back to the shop.",
  },
  {
    icon: RefreshCw,
    title: "Instant Sync",
    description: "Changes and checkouts update instantly across all your team's devices.",
  },
  {
    icon: Lock,
    title: "Secure Records",
    description: "Your guest data and business logs are kept private and secure.",
  },
  {
    icon: Box,
    title: "Smart Inventory",
    description: "Never overbook again. See your real-time availability at a glance.",
  },
];

export function Features() {
  return (
    <section className="w-full bg-foreground text-background py-32 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight max-w-2xl leading-tight">
            Everything you need to run your operations.
          </h2>
          <p className="text-zinc-400 font-light max-w-sm text-lg tracking-tight">
            Purpose-built tools to keep your business moving without the clutter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800">
          {featureData.map((feature, index) => (
            <div
              key={index}
              className="bg-foreground p-10 flex flex-col hover:bg-zinc-900 transition-colors"
            >
              <feature.icon className="w-8 h-8 mb-8 text-primary" />
              <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-zinc-400 font-light leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
