"use client";

import { useRef } from "react";
import { Editor } from "@monaco-editor/react";
import type * as monaco from "monaco-editor";
import { Play, Send } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { LANGUAGE_ID_MAP } from "@/config/constants";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  disableCopyPaste: boolean;
}

export function CodeEditor({
  code,
  onChange,
  language,
  onRun,
  onSubmit,
  isRunning,
  disableCopyPaste,
}: CodeEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const onMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: typeof import("monaco-editor"),
  ) => {
    editorRef.current = editor;
    editor.focus();

    if (disableCopyPaste) {
      editor.onKeyDown((event) => {
        const { keyCode, ctrlKey, metaKey } = event;
        if (
          (keyCode === 52 || keyCode === 33 || keyCode === 88) &&
          (metaKey || ctrlKey)
        ) {
          event.preventDefault();
        }
      });
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[#2D2D2D] px-4 py-2">
        <Select defaultValue={language} disabled>
          <SelectTrigger className="w-32 border-[#2D2D2D] bg-transparent text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent defaultValue={language}>
            {Object.keys(LANGUAGE_ID_MAP).map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onRun}
            disabled={isRunning}
            className="gap-1.5 border-[#2D2D2D] bg-transparent text-white hover:bg-[#2D2D2D]"
          >
            <Play className="h-4 w-4" />
            Run
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isRunning}
            className="gap-1.5 bg-[#7EBF8E] text-white hover:bg-[#6CAF7E]"
          >
            <Send className="h-4 w-4" />
            Submit
          </Button>
        </div>
      </div>

      <Editor
        height="100%"
        defaultLanguage={language.toLowerCase()}
        defaultValue=""
        onChange={(value) => onChange(value ?? "")}
        className="flex-1"
        value={code}
        language={language.toLowerCase()}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: "JetBrains Mono, monospace",
          automaticLayout: true,
          contextmenu: !disableCopyPaste,
        }}
        onMount={onMount}
      />
    </div>
  );
}
