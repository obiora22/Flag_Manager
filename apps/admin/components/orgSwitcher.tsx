"use client";

import { useSession } from "next-auth/react";
// import { switchOrganization } from '@/app/actions/auth';

export function OrgSwitcher() {
  const { data: session, update } = useSession();

  const handleOrgSwitch = async (orgId: string) => {
    const activeMembership = session && session.user.memberships.find((m) => m.orgId === orgId);

    if (!activeMembership) return null;
    // Update session
    await update({ activeOrgId: orgId, activeRole: activeMembership.role });

    // Optionally call server action to persist preference
    // await switchOrganization(orgId);

    // Refresh page to reload org-specific data
    // window.location.reload();
  };

  if (!session?.user.memberships || session.user.memberships.length <= 1) {
    return null; // Only one org, no need to switch
  }

  // const activeOrg = session.memberships.find(
  //   m => m.orgId === session.activeOrgId
  // );

  return (
    <div className="relative">
      <select
        value={session.activeOrgId || ""}
        onChange={(e) => handleOrgSwitch(e.target.value)}
        className="px-3 py-2 border rounded-lg"
      >
        {session.user.memberships.map((membership) => (
          <option key={membership.orgId} value={membership.orgId}>
            {membership.org.name} ({membership.role})
          </option>
        ))}
      </select>
    </div>
  );
}
