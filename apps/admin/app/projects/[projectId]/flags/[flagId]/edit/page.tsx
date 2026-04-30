"use client";

import { FlagForm } from "@admin/component/FlagForm";

interface FlagEditProps {
  params: {
    projectId: string;
    flagId: string;
  };
}

export default function FlagEdit({ params }: FlagEditProps) {
  const { projectId } = params;
  return (
    <div>
      <h1 className="text-center pb-10">Edit Flag</h1>
      <FlagForm projectId={projectId} onCancel={() => undefined} />
    </div>
  );
}
