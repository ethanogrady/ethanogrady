import { useCallback, useRef, useState } from "react";
import { Button, Stack, Text } from "@sanity/ui";
import {
  insert,
  setIfMissing,
  useClient,
  type ArrayOfObjectsInputProps,
} from "sanity";
import { apiVersion } from "../env";

const BATCH_SIZE = 5;

function uniqueKey() {
  return Math.random().toString(36).slice(2, 12);
}

export function BatchImageInput(props: ArrayOfObjectsInputProps) {
  const { onChange } = props;
  const client = useClient({ apiVersion });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ done: number; total: number }>();

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;

      const files = Array.from(fileList);
      setProgress({ done: 0, total: files.length });
      onChange(setIfMissing([]));

      for (let start = 0; start < files.length; start += BATCH_SIZE) {
        const batch = files.slice(start, start + BATCH_SIZE);
        const assets = await Promise.all(
          batch.map((file) =>
            client.assets.upload("image", file, { filename: file.name }),
          ),
        );

        onChange(
          insert(
            assets.map((asset) => ({
              _type: "image",
              _key: uniqueKey(),
              asset: { _type: "reference", _ref: asset._id },
            })),
            "after",
            [-1],
          ),
        );

        setProgress({
          done: Math.min(start + BATCH_SIZE, files.length),
          total: files.length,
        });
      }

      setProgress(undefined);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [client, onChange],
  );

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Stack space={2}>
        <Button
          mode="ghost"
          text={
            progress
              ? `Uploading ${progress.done} / ${progress.total}...`
              : "Upload multiple images"
          }
          disabled={Boolean(progress)}
          onClick={() => fileInputRef.current?.click()}
        />
        {progress ? (
          <Text size={1} muted>
            Keep this tab open until the upload finishes.
          </Text>
        ) : null}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          hidden
          onChange={(event) => handleFiles(event.currentTarget.files)}
        />
      </Stack>
    </Stack>
  );
}
