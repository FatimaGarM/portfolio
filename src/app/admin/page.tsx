import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPanel from "./AdminPanel";
import LoginForm from "./LoginForm";
import { adminEnabled } from "@/lib/adminEnabled";
import { isAuthenticated } from "@/lib/auth";
import { readContent } from "@/lib/repository";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Panel · Portfolio", robots: { index: false, follow: false } };

async function hasSession() {
  try {
    return await isAuthenticated();
  } catch {
    return false;
  }
}

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminPage({ searchParams }: Props) {
  if (!adminEnabled) notFound();
  if (!(await hasSession())) return <LoginForm error={(await searchParams).error} />;
  return <AdminPanel initialContent={await readContent()} />;
}
