"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import BackgroundMusicEditor from "@/components/background-music-editor";
import type { BackgroundMusicTrack } from "@/lib/types";

type Props = {
  showMusicEditor: boolean;
  tracks: BackgroundMusicTrack[];
  onTracksChange: (next: BackgroundMusicTrack[]) => void;
  onMusicUpload: (file: File) => void;
  musicUploading: boolean;
  isResumeUploading: boolean;
  onResumePick: () => void;
  onExportPortfolio: () => void;
  onImportPick: () => void;
  onRevertSession: () => void;
  previewAsVisitor: boolean;
  onTogglePreview: () => void;
  onLogout: () => void;
};

/** Grouped edit actions (bottom-left) so the bar is easier to scan. */
export default function EditToolbarPanel({
  showMusicEditor,
  tracks,
  onTracksChange,
  onMusicUpload,
  musicUploading,
  isResumeUploading,
  onResumePick,
  onExportPortfolio,
  onImportPick,
  onRevertSession,
  previewAsVisitor,
  onTogglePreview,
  onLogout,
}: Props) {
  return (
    <Card className="max-w-sm border-border/70 bg-background/95 shadow-xl backdrop-blur-md">
      <CardHeader className="space-y-0 pb-2 pt-3">
        <CardTitle className="text-sm font-semibold tracking-tight">Site editor</CardTitle>
        <p className="text-[11px] text-muted-foreground leading-snug">
          Changes save automatically while you edit sections on the page.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 pb-3 pt-0">
        {showMusicEditor ? (
          <>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Background music</Label>
              <BackgroundMusicEditor
                embedded
                tracks={tracks}
                onTracksChange={onTracksChange}
                onUploadFile={onMusicUpload}
                isUploading={musicUploading}
              />
            </div>
            <Separator />
          </>
        ) : null}

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Files & backup</Label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button
              type="button"
              data-matrix-cta
              size="sm"
              variant="secondary"
              className="w-full justify-center"
              disabled={isResumeUploading}
              onClick={onResumePick}
            >
              {isResumeUploading ? "Uploading…" : "Upload resume"}
            </Button>
            <Button
              type="button"
              data-matrix-cta
              size="sm"
              variant="secondary"
              className="w-full justify-center"
              onClick={onExportPortfolio}
            >
              Export JSON
            </Button>
            <Button
              type="button"
              data-matrix-cta
              size="sm"
              variant="secondary"
              className="w-full justify-center"
              onClick={onImportPick}
            >
              Import JSON
            </Button>
            <Button
              type="button"
              data-matrix-cta
              size="sm"
              variant="outline"
              className="w-full justify-center"
              onClick={onRevertSession}
            >
              Revert session
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Preview</Label>
          <Button
            type="button"
            data-matrix-cta
            size="sm"
            variant="outline"
            className="w-full"
            onClick={onTogglePreview}
          >
            {previewAsVisitor ? "Stop visitor preview" : "Preview as visitor"}
          </Button>
        </div>

        <Button type="button" data-matrix-cta variant="destructive" size="sm" className="w-full" onClick={onLogout}>
          Logout & exit edit mode
        </Button>
      </CardContent>
    </Card>
  );
}
