"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { VoiceRecord } from "@/lib/types/voice-record";

interface TextInputProps {
  onRecordComplete?: (record: VoiceRecord) => void;
  onTranscript?: (text: string) => void;
}

export function TextInput({ onRecordComplete, onTranscript }: TextInputProps) {
  const [textInput, setTextInput] = useState<string>("");

  const handleSubmit = () => {
    if (!textInput.trim()) {
      return;
    }

    const record: VoiceRecord = {
      id: `text-${Date.now()}`,
      type: "note",
      status: "completed",
      transcript: textInput.trim(),
      duration: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (onRecordComplete) {
      onRecordComplete(record);
    }
    if (onTranscript) {
      onTranscript(textInput.trim());
    }

    setTextInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="输入您的记录内容...（按 Cmd/Ctrl + Enter 提交）"
        className="min-h-[120px]"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          提示：按 Cmd/Ctrl + Enter 快速提交
        </p>
        <Button
          onClick={handleSubmit}
          disabled={!textInput.trim()}
          variant="default"
        >
          提交
        </Button>
      </div>
    </div>
  );
}

