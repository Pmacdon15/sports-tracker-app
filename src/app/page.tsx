import { Show } from "@clerk/nextjs";
import { ArrowRight, Zap, Shield, BarChart3, Clock, Users, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-sports.jpg"
            alt="Athletes in action"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 md:px-8 py-20">
          <div className="max-w-2xl">
            <p className="text-primary font-semibold tracking-wide uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              Equipment Tracking Platform
            </p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Track Every
              <span className="text-primary block">Piece of Gear</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Real-time inventory management for sports rentals. Never lose track of a kayak, bike, or any piece of equipment again.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Suspense>
                <Show when="signed-out">
                  <Link href="/inventory">
                    <Button size="lg" className="w-full sm:w-auto font-bold gap-2 text-base px-8">
                      Get Started Free
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/plans">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold text-base px-8 border-2">
                      View Plans
                    </Button>
                  </Link>
                </Show>
              </Suspense>
              <Suspense>
                <Show when="signed-in">
                  <Button
                    size="lg"
                    render={<Link href="/tracker" />}
                    nativeButton={false}
                    className="w-full sm:w-auto font-bold gap-2 text-base px-8"
                  >
                    Go to Tracker
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    render={<Link href="/inventory" />}
                    nativeButton={false}
                    className="w-full sm:w-auto font-semibold text-base px-8 border-2"
                  >
                    View Inventory
                  </Button>
                </Show>
              </Suspense>
            </div>

            {/* Stats Row */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <div>
                <p className="text-3xl font-black text-primary">10K+</p>
                <p className="text-sm text-muted-foreground">Items Tracked</p>
              </div>
              <div>
                <p className="text-3xl font-black text-primary">99.9%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
              <div>
                <p className="text-3xl font-black text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold tracking-wide uppercase mb-3">Features</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-balance">
              Everything You Need to Manage Gear
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for rental shops, adventure companies, and sports facilities that need reliable equipment tracking.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Large Feature Card */}
            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden group">
              <Image
                src="/images/tracking-gear.jpg"
                alt="Equipment tracking dashboard"
                width={800}
                height={400}
                className="w-full h-full object-cover min-h-[300px] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold text-sm uppercase tracking-wide">Real-Time Tracking</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Live Inventory Updates</h3>
                <p className="text-muted-foreground max-w-md">
                  See what&apos;s checked out, what&apos;s returning, and get alerts when equipment is overdue.
                </p>
              </div>
            </div>

            {/* Vertical Feature Card */}
            <div className="bg-card rounded-2xl p-8 border border-border/50 flex flex-col justify-between min-h-[300px]">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Enterprise-grade security with encrypted data and role-based access controls.
                </p>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-primary rounded-2xl p-8 text-primary-foreground flex flex-col justify-between min-h-[250px]">
              <div className="w-14 h-14 rounded-xl bg-primary-foreground/20 flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Analytics & Reports</h3>
                <p className="text-primary-foreground/80">
                  Track usage patterns, popular equipment, and optimize your inventory.
                </p>
              </div>
            </div>

            {/* Time Tracking Card */}
            <div className="bg-card rounded-2xl p-8 border border-border/50 flex flex-col justify-between min-h-[250px]">
              <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Duration Alerts</h3>
                <p className="text-muted-foreground">
                  Color-coded time tracking shows when rentals are approaching their limit.
                </p>
              </div>
            </div>

            {/* Team Card */}
            <div className="bg-card rounded-2xl p-8 border border-border/50 flex flex-col justify-between min-h-[250px]">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Guest Management</h3>
                <p className="text-muted-foreground">
                  Keep detailed logs of every guest and their rental history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Team Section */}
      <section className="py-24 px-4 md:px-8 bg-card/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src="/images/team-sports.jpg"
                alt="Team using Sports Tracker"
                width={600}
                height={500}
                className="w-full h-full object-cover min-h-[400px]"
              />
            </div>

            {/* Content */}
            <div>
              <p className="text-primary font-semibold tracking-wide uppercase mb-3">Built for Teams</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
                Used by Adventure Companies Everywhere
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                From small kayak rental shops to large adventure outfitters, Sports Tracker helps teams of all sizes manage their equipment efficiently.
              </p>

              {/* Benefits List */}
              <div className="space-y-4">
                {[
                  "Reduce lost equipment by 95%",
                  "Save hours on inventory management",
                  "Never double-book gear again",
                  "Track maintenance schedules",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Suspense>
                  <Show when="signed-out">
                    <Link href="/inventory">
                      <Button size="lg" className="font-bold gap-2 text-base px-8">
                        Start Tracking Today
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>
                  </Show>
                </Suspense>
                <Suspense>
                  <Show when="signed-in">
                    <Button
                      size="lg"
                      render={<Link href="/tracker" />}
                      nativeButton={false}
                      className="font-bold gap-2 text-base px-8"
                    >
                      Open Tracker
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Show>
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 via-card to-accent/10 border border-border/50 p-12 md:p-20 text-center">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                Ready to Take Control of Your Equipment?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join hundreds of adventure companies already using Sports Tracker to manage their gear.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Suspense>
                  <Show when="signed-out">
                    <Link href="/inventory">
                      <Button size="lg" className="font-bold gap-2 text-base px-8">
                        Get Started Free
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>
                  </Show>
                </Suspense>
                <Suspense>
                  <Show when="signed-in">
                    <Button
                      size="lg"
                      render={<Link href="/tracker" />}
                      nativeButton={false}
                      className="font-bold gap-2 text-base px-8"
                    >
                      Go to Tracker
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Show>
                </Suspense>
                <Link href="/plans">
                  <Button size="lg" variant="outline" className="font-semibold text-base px-8 border-2">
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
