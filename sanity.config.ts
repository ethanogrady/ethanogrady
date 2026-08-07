import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { media } from "sanity-plugin-media";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";

const SETTINGS_ID = "siteSettings";

export default defineConfig({
  name: "ethanogrady",
  title: "Ethan O'Grady",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title("Content")
          .items([
            orderableDocumentListDeskItem({
              type: "project",
              title: "Projects",
              S,
              context,
            }),
            S.divider(),
            S.listItem()
              .title("Info")
              .id(SETTINGS_ID)
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId(SETTINGS_ID)
                  .title("Info"),
              ),
          ]),
    }),
    media(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => schemaType !== "siteSettings"),
  },
  document: {
    newDocumentOptions: (prev) =>
      prev.filter(({ templateId }) => templateId !== "siteSettings"),
  },
});
