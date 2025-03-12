import { categoryTranslations } from "@/data";

export function translateCategory(category: string | null): string {
  if (!category) return "";
  return categoryTranslations[category] || category;
}
