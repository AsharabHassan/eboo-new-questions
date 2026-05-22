import { ResultLoader } from "@/components/result/result-loader";

export const metadata = {
  title: "Your Assessment · HSW EBOO",
};

export default async function ResultRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ResultLoader id={id} />;
}
