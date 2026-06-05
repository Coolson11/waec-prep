import Link from "next/link";
import { Check, Sparkles, Zap, ShieldCheck, ArrowRight, Star } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Standard",
      description: "Ideal for basic preparation and casual study.",
      price: "0",
      duration: "lifetime",
      features: [
        "5 Lifetime Paper Previews",
        "3 Lifetime PDF Downloads",
        "Access to Basic Subjects",
        "Community Support",
      ],
      button: "Get Started Free",
      href: "/auth/signin",
      featured: false,
      color: "indigo"
    },
    {
      name: "Premium",
      description: "The complete package for dedicated students.",
      price: "20",
      duration: "month",
      features: [
        "Unlimited Paper Previews",
        "Unlimited PDF Downloads",
        "Full Archive Access",
        "Step-by-step Solutions",
        "Ad-Free Experience",
        "Priority Support",
      ],
      button: "Unlock Premium",
      href: "#",
      featured: true,
      color: "emerald"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
          <Zap className="h-3.5 w-3.5 fill-current" />
          Pricing Plans
        </div>
        <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
          Simple & <span className="text-indigo-600">Transparent</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg leading-relaxed">
          Choose the right plan to accelerate your learning. No hidden fees, just pure academic growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`relative flex flex-col p-10 rounded-[3rem] border transition-all duration-500 hover:shadow-2xl ${
              plan.featured 
                ? "bg-slate-900 border-slate-800 text-white shadow-xl shadow-indigo-500/10 scale-105 z-10" 
                : "bg-white border-slate-100 text-slate-900 shadow-sm hover:border-indigo-100"
            }`}
          >
            {plan.featured && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-lg">
                Recommended
              </div>
            )}

            <div className="space-y-2">
              <h3 className={`text-2xl font-black tracking-tight ${plan.featured ? "text-white" : "text-slate-900"}`}>
                {plan.name}
              </h3>
              <p className={`text-sm font-medium ${plan.featured ? "text-slate-400" : "text-slate-500"}`}>
                {plan.description}
              </p>
            </div>

            <div className="mt-8 flex items-baseline gap-2">
              <span className={`text-5xl font-black tracking-tight ${plan.featured ? "text-white" : "text-slate-900"}`}>
                NLe {plan.price}
              </span>
              <span className={`text-sm font-bold uppercase tracking-widest ${plan.featured ? "text-slate-500" : "text-slate-400"}`}>
                / {plan.duration}
              </span>
            </div>

            <div className={`mt-10 pt-10 border-t ${plan.featured ? "border-slate-800" : "border-slate-50"}`}>
              <ul className="space-y-5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-4">
                    <div className={`mt-1 rounded-full p-0.5 ${plan.featured ? "bg-emerald-500/20" : "bg-indigo-50"}`}>
                      <Check className={`h-3.5 w-3.5 ${plan.featured ? "text-emerald-400" : "text-indigo-600"}`} strokeWidth={4} />
                    </div>
                    <span className={`text-sm font-bold ${plan.featured ? "text-slate-300" : "text-slate-600"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-12">
              <Link
                href={plan.href}
                className={`w-full inline-flex items-center justify-center gap-2 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] ${
                  plan.featured 
                    ? "bg-white text-slate-900 hover:bg-slate-100 shadow-xl" 
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                }`}
              >
                {plan.button} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="max-w-xl mx-auto bg-slate-50 rounded-[2rem] p-8 text-center border border-slate-100 space-y-4">
        <div className="flex justify-center gap-1">
          {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
        </div>
        <p className="text-slate-600 font-medium italic leading-relaxed">
          &ldquo;The premium plan literally saved my grades. The solutions are so much clearer than anything I found online.&rdquo;
        </p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">— Amadu K., Science Student</p>
      </div>

      <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
        <ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure Payments by Monime • Cancel Anytime
      </p>
    </div>
  );
}
