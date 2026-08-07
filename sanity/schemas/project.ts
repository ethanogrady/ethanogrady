import { defineField, defineType } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";
import { BatchImageInput } from "../components/BatchImageInput";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (rule) => rule.min(1900).max(2200).integer(),
    }),
    defineField({
      name: "cover",
      title: "Cover image",
      description: "Shown on the grid and when hovering the list.",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Images",
      description: "Drag to reorder. This is the order shown in the project.",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      options: { layout: "grid" },
      components: { input: BatchImageInput },
      validation: (rule) => rule.min(1),
    }),
    orderRankField({ type: "project" }),
  ],
  preview: {
    select: { title: "title", subtitle: "year", media: "cover" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle ? String(subtitle) : undefined, media };
    },
  },
});
