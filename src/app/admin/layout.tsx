import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard — Milind Prabhakar",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
