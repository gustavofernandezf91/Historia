import LessonPlayer from "@/components/lesson/LessonPlayer";

export default async function LeccionPage({
  params,
}: {
  params: Promise<{ unidadId: string; leccionId: string }>;
}) {
  const { unidadId, leccionId } = await params;

  return <LessonPlayer unidadId={unidadId} leccionId={leccionId} />;
}
