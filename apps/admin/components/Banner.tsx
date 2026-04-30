import { useState } from "react";

interface Props {
  message: string | null;
}
export function Banner({ message }: Props) {
  const [open, setOpen] = useState(true);

  return open && message ? (
    <div className="border rounded-sm text-center pb-4 px-2 w-full">
      <p onClick={() => setOpen(false)} className="text-right cursor-pointer">
        x
      </p>
      <p>{message}</p>
    </div>
  ) : null;
}
