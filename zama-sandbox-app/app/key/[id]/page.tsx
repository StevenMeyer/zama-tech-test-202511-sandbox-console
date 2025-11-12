import { Key } from "@/components/key/Key";
import { verifySession, getKey, getKeyAnalytics } from "@/lib/dal";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{ id: string }>;
}
export default async function KeyPage({ params }: Props) {
    const session = await verifySession();
  if (!session.isAuth) {
    redirect('/login');
  }
  const { id } = await params;
  if (!id?.trim()) {
    redirect('/');
  }
  const [key, analytics] = await Promise.all([
    getKey(id),
    getKeyAnalytics(id),
  ]);
  if (!key) {
    redirect('/');
  }
  return <Key apiKey={key} analytics={analytics} />;
}