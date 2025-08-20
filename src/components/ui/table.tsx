import type { ComponentProps } from "react";

export function Th({
  children,
  className = "",
  ...rest
}: ComponentProps<"th">) {
  return (
    <th className={`px-4 py-3 font-medium ${className}`} {...rest}>
      {children}
    </th>
  );
}

export function Td({
  children,
  className = "",
  ...rest
}: ComponentProps<"td">) {
  return (
    <td className={`px-4 py-4 ${className}`} {...rest}>
      {children}
    </td>
  );
}
