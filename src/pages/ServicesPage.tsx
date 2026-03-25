import React from "react";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import {
  ClockIcon,
  TargetIcon,
  BarChart3Icon,
  Building2Icon,
  ZapIcon,
  CarIcon,
  FileTextIcon,
  GlobeIcon,
  ArrowRightIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "DAILY SAVING (AJOOR)",
    description:
      "Automate your daily savings and reach your financial goals faster with our group savings system.",
    icon: ClockIcon,
    path: "/calendar",
    color: "bg-ajo-50 text-ajo-600",
    borderColor: "border-ajo-100",
  },
  {
    title: "TARGET SAVING",
    description:
      "Set specific goals for weddings, education, or travel and save towards them systematically.",
    icon: TargetIcon,
    path: "/plans",
    color: "bg-blue-50 text-blue-600",
    borderColor: "border-blue-100",
  },
  {
    title: "FIX INVESTMENT",
    description:
      "Grow your wealth with competitive interest rates on fixed-term investment plans.",
    icon: BarChart3Icon,
    path: "#",
    color: "bg-purple-50 text-purple-600",
    borderColor: "border-purple-100",
  },
  {
    title: "BUSINESS LOAN/SALARY LOAN",
    description:
      "Access quick capital for your business or personal needs with flexible repayment options.",
    icon: Building2Icon,
    path: "/loan-application?type=salary",
    color: "bg-orange-50 text-orange-600",
    borderColor: "border-orange-100",
  },
  {
    title: "QUICK LOAN (DAILY REPAYMENT)",
    description:
      "Get instant cash for emergencies and repay comfortably through daily micro-payments.",
    icon: ZapIcon,
    path: "/loan-application?type=quick",
    color: "bg-yellow-50 text-yellow-600",
    borderColor: "border-yellow-100",
  },
  {
    title: "ASSET FINANCING",
    description:
      "Acquire essential assets for your business or personal use with our tailored financing solutions.",
    icon: CarIcon,
    path: "#",
    color: "bg-indigo-50 text-indigo-600",
    borderColor: "border-indigo-100",
  },
  {
    title: "LPO FINANCING",
    description:
      "Fulfill your supply contracts and Local Purchase Orders without worrying about upfront costs.",
    icon: FileTextIcon,
    path: "#",
    color: "bg-cyan-50 text-cyan-600",
    borderColor: "border-cyan-100",
  },
  {
    title: "VISA ACCOUNT FUNDING",
    description:
      "Simplify your international travel and study plans with our visa account funding assistance.",
    icon: GlobeIcon,
    path: "#",
    color: "bg-emerald-50 text-emerald-600",
    borderColor: "border-emerald-100",
  },
];

export function ServicesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-ink tracking-tight">
          Our Services
        </h1>
        <p className="text-ink-secondary mt-2 text-lg">
          Explore our wide range of financial solutions designed to help you
          grow, save, and succeed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Link
              to={service.path}
              className={
                service.path === "#" ? "cursor-default" : "cursor-pointer"
              }
            >
              <Card
                className={`group h-full p-6 rounded-3xl border border-gray-100 hover:border-ajo-200 hover:shadow-md transition-all duration-300 flex flex-col`}
              >
                <div
                  className={`w-12 h-12 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <service.icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-ink mb-3 group-hover:text-ajo-600 transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-ink-secondary leading-relaxed mb-6 flex-1">
                  {service.description}
                </p>

                <div className="flex items-center text-sm font-semibold text-ajo-600 group-hover:gap-2 transition-all">
                  <span>
                    {service.path === "#" ? "Coming Soon" : "Get Started"}
                  </span>
                  {service.path !== "#" && (
                    <ArrowRightIcon className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                  )}
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
