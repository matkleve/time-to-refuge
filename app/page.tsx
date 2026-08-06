import { TimekeeperApp } from "@/components/TimekeeperApp";
import type { AppView } from "@/components/atoms/ViewMenu";

const APP_VIEWS: AppView[] = [
  "home",
  "fields",
  "people",
  "refuge",
  "quicklog",
  "history",
];

function parseView(value: string | undefined): AppView {
  if (value && APP_VIEWS.includes(value as AppView)) {
    return value as AppView;
  }
  return "home";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  return <TimekeeperApp initialView={parseView(view)} />;
}
