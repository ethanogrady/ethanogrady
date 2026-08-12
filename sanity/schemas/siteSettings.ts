import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Info",
  type: "document",
  fields: [
    defineField({
      name: "wordmark",
      title: "Name in the header",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Search and social description",
      type: "text",
      rows: 2,
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "statement",
      title: "Opening statement",
      description: "The large paragraph at the top of the info page.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "notes",
      title: "Further notes",
      description: "Drag to reorder paragraphs.",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 4 })],
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "basedIn",
      title: "Based in",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "clients",
      title: "Selected clients",
      description: "Drag to reorder. This is the order shown on the info page.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { sortable: true },
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "socials",
      title: "Social links",
      description: "Drag to reorder.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "social",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Info" };
    },
  },
});
