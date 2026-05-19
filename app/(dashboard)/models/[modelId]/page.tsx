import { generateModels } from "@/mocks/data/model-registry";

import { ModelDetailClient } from "./model-detail-client";

function generateStaticParams() {
  return generateModels(16).map((model) => ({
    modelId: model.id,
  }));
}

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ modelId: string }>;
}) {
  const { modelId } = await params;

  return <ModelDetailClient modelId={modelId} />;
}

export { generateStaticParams };
