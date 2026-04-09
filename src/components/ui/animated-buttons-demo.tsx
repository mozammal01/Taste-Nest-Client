"use client";

import React from "react";
import { Button } from "./button";
import { AnimatedButton } from "./animated-button";

export default function AnimatedButtonsDemo() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-800">TasteNest Animated Buttons</h2>
        <p className="text-gray-600 text-lg">A collection of beautiful animated buttons for your restaurant website</p>
      </div>

      {/* Enhanced Button Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-primary pb-2">Enhanced Button Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700">Bouncy Effect</h3>
            <Button variant="bouncy" size="lg">
              Order Now
            </Button>
            <p className="text-sm text-gray-600">Scales up on hover with bounce effect</p>
          </div>

          <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700">Glow Effect</h3>
            <Button variant="glow" size="lg">
              Reserve Table
            </Button>
            <p className="text-sm text-gray-600">Glowing shadow effect on hover</p>
          </div>

          <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700">Pulse Effect</h3>
            <Button variant="pulse" size="lg">
              View Menu
            </Button>
            <p className="text-sm text-gray-600">Pulsing animation with color change</p>
          </div>
        </div>
      </section>

      {/* Advanced Animated Buttons */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-primary pb-2">Advanced Animated Buttons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700">Bounce</h3>
            <AnimatedButton variant="bounce" size="lg">
              🍕 Order Pizza
            </AnimatedButton>
            <p className="text-sm text-gray-600">Bounces on hover</p>
          </div>

          <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700">Slide Effect</h3>
            <AnimatedButton variant="slide" size="lg">
              ✨ Special Offer
            </AnimatedButton>
            <p className="text-sm text-gray-600">Light slides across button</p>
          </div>

          <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700">Shake Effect</h3>
            <AnimatedButton variant="shake" size="lg">
              🔔 Get Notified
            </AnimatedButton>
            <p className="text-sm text-gray-600">Shakes on hover</p>
          </div>

          <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700">Ripple Effect</h3>
            <AnimatedButton variant="ripple" size="lg">
              💧 Fresh Drinks
            </AnimatedButton>
            <p className="text-sm text-gray-600">Ripple effect from center</p>
          </div>

          <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700">Gradient Shift</h3>
            <AnimatedButton variant="gradientShift" size="lg">
              🌈 Colorful Menu
            </AnimatedButton>
            <p className="text-sm text-gray-600">Gradient shifts on hover</p>
          </div>

          <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700">Neon Effect</h3>
            <AnimatedButton variant="neon" size="lg">
              ⚡ Night Menu
            </AnimatedButton>
            <p className="text-sm text-gray-600">Neon glow effect</p>
          </div>

          <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700">3D Effect</h3>
            <AnimatedButton variant="threeDimensional" size="lg">
              🎯 Book Table
            </AnimatedButton>
            <p className="text-sm text-gray-600">3D depth effect</p>
          </div>

          <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700">Loading Effect</h3>
            <AnimatedButton variant="loading" size="lg">
              ⏳ Processing
            </AnimatedButton>
            <p className="text-sm text-gray-600">Shimmer loading effect</p>
          </div>

          <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700">Morphing</h3>
            <AnimatedButton variant="morph" size="lg">
              🔄 Transform
            </AnimatedButton>
            <p className="text-sm text-gray-600">Morphs shape on hover</p>
          </div>
        </div>
      </section>

      {/* Different Sizes */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-primary pb-2">Different Sizes</h2>
        <div className="flex flex-wrap items-center gap-4 p-6 bg-gray-50 rounded-lg">
          <AnimatedButton variant="bounce" size="sm">
            Small
          </AnimatedButton>
          <AnimatedButton variant="glow" size="default">
            Default
          </AnimatedButton>
          <AnimatedButton variant="pulse" size="lg">
            Large
          </AnimatedButton>
          <AnimatedButton variant="gradientShift" size="xl">
            Extra Large
          </AnimatedButton>
          <AnimatedButton variant="neon" size="icon">
            🍔
          </AnimatedButton>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-primary pb-2">Restaurant Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 p-6 bg-linear-to-br from-red-50 to-red-100 rounded-lg">
            <h3 className="font-semibold text-gray-700">Call-to-Action Buttons</h3>
            <div className="space-y-3">
              <AnimatedButton variant="bounce" size="lg" className="w-full">
                🍕 Order Online Now
              </AnimatedButton>
              <AnimatedButton variant="glow" size="lg" className="w-full">
                📞 Call for Reservation
              </AnimatedButton>
              <AnimatedButton variant="pulse" size="lg" className="w-full">
                📍 Find Location
              </AnimatedButton>
            </div>
          </div>

          <div className="space-y-4 p-6 bg-linear-to-br from-yellow-50 to-yellow-100 rounded-lg">
            <h3 className="font-semibold text-gray-700">Menu & Special Offers</h3>
            <div className="space-y-3">
              <AnimatedButton variant="gradientShift" size="lg" className="w-full">
                🌟 Today&apos;s Special
              </AnimatedButton>
              <AnimatedButton variant="slide" size="lg" className="w-full">
                📋 View Full Menu
              </AnimatedButton>
              <AnimatedButton variant="neon" size="lg" className="w-full">
                🎉 Happy Hour Deals
              </AnimatedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-primary pb-2">How to Use</h2>
        <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">{/* Import the components */}</p>
              <p>import &#123; Button &#125; from &quot;@/components/ui/button&quot;;</p>
              <p>import &#123; AnimatedButton &#125; from &quot;@/components/ui/animated-button&quot;;</p>
            </div>

            <div>
              <p className="text-gray-400">{/* Enhanced button variants */}</p>
              <p>&lt;Button variant=&quot;bouncy&quot; size=&quot;lg&quot;&gt;Order Now&lt;/Button&gt;</p>
              <p>&lt;Button variant=&quot;glow&quot; size=&quot;lg&quot;&gt;Reserve Table&lt;/Button&gt;</p>
              <p>&lt;Button variant=&quot;pulse&quot; size=&quot;lg&quot;&gt;View Menu&lt;/Button&gt;</p>
            </div>

            <div>
              <p className="text-gray-400">{/* Advanced animated buttons */}</p>
              <p>&lt;AnimatedButton variant=&quot;bounce&quot;&gt;Bounce Effect&lt;/AnimatedButton&gt;</p>
              <p>&lt;AnimatedButton variant=&quot;slide&quot;&gt;Slide Effect&lt;/AnimatedButton&gt;</p>
              <p>&lt;AnimatedButton variant=&quot;neon&quot;&gt;Neon Effect&lt;/AnimatedButton&gt;</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
