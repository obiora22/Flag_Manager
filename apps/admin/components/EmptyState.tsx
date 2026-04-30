"use client";
import {
  Inbox,
  Plus,
  FolderKanban,
  Flag,
  Users,
  Search,
  FileText,
  Settings,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  fullPage?: boolean;
}

export function EmptyState({
  icon: Icon = Inbox,
  title = 'No data available',
  message = 'We couldn’t find any data for your request.',
  action,
  secondaryAction,
  fullPage = true,
}: EmptyStateProps) {
  const content = (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center max-w-md mx-auto">
      <div className="w-16 h-16 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-slate-500" />
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 mb-6">{message}</p>

      <div className="flex flex-col gap-3">
        {action &&
          (action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              {action.label}
            </button>
          ))}

        {secondaryAction &&
          (secondaryAction.href ? (
            <Link
              href={secondaryAction.href}
              className="inline-flex items-center justify-center gap-2 text-slate-400 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {secondaryAction.label}
            </Link>
          ) : (
            <button
              onClick={secondaryAction.onClick}
              className="inline-flex items-center justify-center gap-2 text-slate-400 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {secondaryAction.label}
            </button>
          ))}
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
        {content}
      </div>
    );
  }

  return content;
}

/**
 * Preset empty states for common scenarios
 */
export function EmptyProjectsState() {
  return (
    <EmptyState
      icon={FolderKanban}
      title="No projects yet"
      message="Create your first project to get started with feature flags."
      action={{
        label: "Create Project",
        href: "/projects/new",
      }}
    />
  );
}

export function EmptyFlagsState({ projectId }: { projectId: string }) {
  return (
    <EmptyState
      icon={Flag}
      title="No feature flags yet"
      message="Create your first feature flag to start controlling rollouts."
      action={{
        label: "Create Flag",
        href: `/projects/${projectId}/flags/new`,
      }}
    />
  );
}

export function EmptyTeamState() {
  return (
    <EmptyState
      icon={Users}
      title="No team members yet"
      message="Invite your team members to collaborate on feature flags."
      action={{
        label: "Invite Members",
        href: "/team/invite",
      }}
    />
  );
}

export function EmptySearchState({ onClearSearch }: { onClearSearch: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      message="Try adjusting your search or filters to find what you're looking for."
      action={{
        label: "Clear Search",
        onClick: onClearSearch,
      }}
      fullPage={false}
    />
  );
}

export function EmptyFilterState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title="No items match your filters"
      message="Try adjusting or removing some filters to see more results."
      action={{
        label: "Clear Filters",
        onClick: onClearFilters,
      }}
      fullPage={false}
    />
  );
}

export function EmptyDocumentationState() {
  return (
    <EmptyState
      icon={FileText}
      title="No documentation yet"
      message="Add documentation to help your team understand this feature."
      action={{
        label: "Add Documentation",
        href: "#",
      }}
    />
  );
}

export function EmptySettingsState() {
  return (
    <EmptyState
      icon={Settings}
      title="No settings configured"
      message="Configure your settings to customize your experience."
      action={{
        label: "Configure Settings",
        href: "/settings",
      }}
    />
  );
}
