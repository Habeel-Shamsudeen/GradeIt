"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type * as monaco from "monaco-editor";
import { Play, Send } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { useDebounce } from "@uidotdev/usehooks";
import { useTheme } from "next-themes";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { LANGUAGE_ID_MAP } from "@/config/constants";
import { Language } from "@/lib/types/config-types";
import { LanguageIcon } from "../../ui/language-icon";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  disableCopyPaste: boolean;
}

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

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
  const codeRef = useRef<string>(code);
  const { theme } = useTheme();
  const [liveCode, setLiveCode] = useState(code);

  const debouncedCode = useDebounce(liveCode, 400);

  useEffect(() => {
    if (debouncedCode !== code) {
      onChange(debouncedCode);
    }
  }, [debouncedCode, onChange]);

  const handleEditorChange = (value: string | undefined) => {
    const updatedCode = value || "";
    codeRef.current = updatedCode;
    setLiveCode(updatedCode);
  };

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
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2">
        <Select value={language} disabled>
          <SelectTrigger className="w-32 border-border bg-transparent text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent defaultValue={language}>
            {Object.keys(LANGUAGE_ID_MAP).map((lang) => (
              <SelectItem key={lang} value={lang}>
                <LanguageIcon language={lang as Language} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onRun}
            disabled={isRunning}
            className="gap-1.5 border-border bg-muted text-foreground hover:bg-muted/70"
          >
            <Play className="h-4 w-4" />
            Run
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isRunning}
            className="gap-1.5 bg-status-passed text-status-passed-foreground hover:bg-status-passed/90"
          >
            <Send className="h-4 w-4" />
            Submit
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <Editor
        height="100%"
        defaultLanguage={language.toLowerCase()}
        defaultValue=""
        onChange={handleEditorChange}
        className="flex-1"
        value={liveCode}
        language={language.toLowerCase()}
        theme={theme === "dark" ? "vs-dark" : "light"}
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
