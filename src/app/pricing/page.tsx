import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Simple, Transparent Pricing
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Choose the plan that fits your preparation needs. Upgrade anytime.
      </p>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
        {/* Free Plan */}
        <div className="flex flex-col p-8 bg-white border rounded-3xl shadow-sm ring-1 ring-gray-200">
          <h3 className="text-lg font-semibold leading-8 text-gray-900">Free</h3>
          <p className="mt-4 text-sm leading-6 text-gray-600">Perfect for getting started.</p>
          <p className="mt-6 flex items-baseline gap-x-1">
            <span className="text-4xl font-bold tracking-tight text-gray-900">NLe 0</span>
          </p>
          <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 text-left">
            <li className="flex gap-x-3">
              <span className="text-blue-600 font-bold">✓</span>
              5 Lifetime Paper Previews
            </li>
            <li className="flex gap-x-3">
              <span className="text-blue-600 font-bold">✓</span>
              3 Lifetime Downloads
            </li>
            <li className="flex gap-x-3">
              <span className="text-blue-600 font-bold">✓</span>
              Access to Basic Subjects
            </li>
          </ul>
          <Link
            href="/auth/signin"
            className="mt-8 block rounded-md bg-gray-50 px-3 py-2 text-center text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
          >
            Get Started for Free
          </Link>
        </div>

        {/* Premium Plan */}
        <div className="flex flex-col p-8 bg-white border-2 border-blue-600 rounded-3xl shadow-lg ring-1 ring-blue-600 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Most Popular
          </div>
          <h3 className="text-lg font-semibold leading-8 text-gray-900">Premium</h3>
          <p className="mt-4 text-sm leading-6 text-gray-600">Everything you need for success.</p>
          <p className="mt-6 flex items-baseline gap-x-1">
            <span className="text-4xl font-bold tracking-tight text-gray-900">NLe 20</span>
            <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
          </p>
          <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 text-left">
            <li className="flex gap-x-3">
              <span className="text-blue-600 font-bold">✓</span>
              Unlimited Downloads
            </li>
            <li className="flex gap-x-3">
              <span className="text-blue-600 font-bold">✓</span>
              Unlimited Previews
            </li>
            <li className="flex gap-x-3">
              <span className="text-blue-600 font-bold">✓</span>
              Full Archive Access
            </li>
            <li className="flex gap-x-3">
              <span className="text-blue-600 font-bold">✓</span>
              Detailed Explanations & Solutions
            </li>
            <li className="flex gap-x-3">
              <span className="text-blue-600 font-bold">✓</span>
              Ad-Free Experience
            </li>
          </ul>
          <button
            className="mt-8 block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white hover:bg-blue-500 shadow-sm"
          >
            Upgrade Now
          </button>
        </div>
      </div>
      
      <p className="mt-12 text-sm text-gray-500">
        Secure payments powered by Monime. Cancel anytime.
      </p>
    </div>
  );
}
