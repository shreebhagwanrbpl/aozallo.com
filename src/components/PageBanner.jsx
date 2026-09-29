"use client";
import { motion } from "framer-motion";
export default function PageBanner({
  title,
  subtitle,
  children,
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50/80 via-white to-green-100/60 py-20 lg:py-28">

      {/* Background Blur */}
      <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-emerald-300/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-300/20 blur-[140px] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(#10b9810f_1px,transparent_1px),linear-gradient(90deg,#10b9810f_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="container-custom relative z-10">

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="mx-auto max-w-4xl text-center"
        >

          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 border border-emerald-300/60 px-4 py-1.5 text-xs sm:text-sm font-semibold text-emerald-800 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Rajbiosis Private Limited</span>
          </span>

          {/* Title */}
          <h1 className="mt-6 text-4xl sm:text-5xl font-black leading-tight text-slate-900 lg:text-6xl tracking-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
            {subtitle}
          </p>

          {/* Optional Children (e.g. Search Box) */}
          {children && (
            <div className="mt-8">
              {children}
            </div>
          )}

        </motion.div>

      </div>

    </section>
  );
}