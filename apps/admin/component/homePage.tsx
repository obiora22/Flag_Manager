"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import {
  Flag,
  Zap,
  Users,
  BarChart3,
  ArrowRight,
  Globe,
  Shield,
  Code,
  ChevronRight,
  Activity,
} from "lucide-react";
import { OrgSwitcher } from "./orgSwitcher";
import { DashboardData } from "@api/src/routes/dashboard.routes";
import { Session } from "next-auth";
import Link from "next/link";

interface Props {
  dashboardData: DashboardData;
  session: Session;
}
export function Dashboard({ dashboardData, session }: Props) {
  const [hoveredCard, setHoveredCard] = useState(null);

  const { totalFlags, totalMembership, totalProjects } = dashboardData;

  const { user } = session;

  const stats = [
    { label: "Active Flags", value: totalFlags, change: "+12%", icon: Flag },
    { label: "Projects", value: totalProjects, change: "+2", icon: Globe },
    { label: "Team Members", value: totalMembership, change: "+3", icon: Users },
    // { label: "Evaluations/day", value: "2.4M", change: "+18%", icon: Activity },
  ];

  const quickActions = [
    {
      title: "Create New Flag",
      description: "Set up a new feature flag with rules and rollouts",
      icon: Flag,
      color: "from-blue-500 to-cyan-500",
      action: "create-flag",
    },
    {
      title: "Manage Projects",
      description: "View and configure your projects and environments",
      icon: Globe,
      color: "from-purple-500 to-pink-500",
      action: "projects",
    },
    {
      title: "Team & Permissions",
      description: "Manage team members and role-based access",
      icon: Shield,
      color: "from-orange-500 to-red-500",
      action: "team",
    },
    {
      title: "API & SDKs",
      description: "Access API keys and integration guides",
      icon: Code,
      color: "from-green-500 to-emerald-500",
      action: "api",
    },
  ];

  const recentActivity = [
    {
      flag: "new-checkout-flow",
      action: "enabled in Production",
      user: "Sarah Chen",
      time: "5m ago",
    },
    {
      flag: "advanced-analytics",
      action: "rollout increased to 50%",
      user: "Mike Johnson",
      time: "12m ago",
    },
    { flag: "dark-mode", action: "created", user: "Alex Rivera", time: "1h ago" },
    { flag: "premium-features", action: "rules updated", user: "Jamie Lee", time: "2h ago" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-white">Feature Flags</h1>
                <p className="text-sm text-slate-400">Production Organization</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="w-30 p-2 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                  <p>{user.firstname[0].toUpperCase() + ". " + user.lastname}</p>
                </div>
              )}
            </div>
            <button onClick={() => signOut()}>Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="max-w-7xlmx-auto pb-8 flex items-center justify-between">
          <OrgSwitcher />
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  {/* <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                    {stat.change}
                  </span> */}
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onMouseEnter={() => setHoveredCard(null)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-left hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1"
                >
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${action.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}
                  />
                  <div className="relative">
                    <div
                      className={`w-12 h-12 bg-linear-to-br ${action.color} rounded-lg flex items-center justify-center mb-4`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                    <p className="text-sm text-slate-400 mb-4">{action.description}</p>
                    <div className="flex items-center text-blue-400 text-sm font-medium">
                      <Link href="/projects">
                        Get started
                        <ArrowRight
                          className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                            hoveredCard === idx ? "translate-x-1" : ""
                          }`}
                        />
                      </Link>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1">
              View all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
            {recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-6 hover:bg-slate-700/20 transition-colors border-b border-slate-700/50 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Flag className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      <span className="text-blue-400 font-mono">{activity.flag}</span>
                    </p>
                    <p className="text-sm text-slate-400">
                      {activity.action} by {activity.user}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-linear-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
            <BarChart3 className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Advanced Analytics</h3>
            <p className="text-sm text-slate-400">
              Track flag performance and user behavior with real-time insights.
            </p>
          </div>
          <div className="bg-linear-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
            <Shield className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Enterprise Security</h3>
            <p className="text-sm text-slate-400">
              Role-based access control and comprehensive audit logging.
            </p>
          </div>
          <div className="bg-linear-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
            <Zap className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-sm text-slate-400">
              Sub-millisecond flag evaluation with global edge distribution.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
