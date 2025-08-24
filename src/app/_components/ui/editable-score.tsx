"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";

interface EditableScoreProps {
  value: number;
  onChange: (newScore: number) => void;
  maxScore?: number;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function EditableScore({
  value,
  onChange,
  maxScore = 100,
  className = "",
  disabled = false,
  placeholder = "0",
}: EditableScoreProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    if (tempValue >= 0 && tempValue <= maxScore) {
      onChange(tempValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 font-semibold dark:text-green-400";
    if (score >= 80) return "text-blue-600 font-semibold dark:text-blue-400";
    if (score >= 70)
      return "text-yellow-600 font-semibold dark:text-yellow-400";
    if (score >= 60)
      return "text-orange-600 font-semibold dark:text-orange-400";
    return "text-red-600 font-semibold dark:text-red-400";
  };

  if (disabled) {
    return (
      <div className={`${getScoreColor(value)} ${className}`}>{value}</div>
    );
  }

  return (
    <div className="relative">
      {isEditing ? (
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(Number(e.target.value))}
            min={0}
            max={maxScore}
            className="w-16 h-8 text-sm"
            placeholder={placeholder}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            onBlur={handleSave}
          />
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-900/20"
            onClick={handleSave}
          >
            <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
            onClick={handleCancel}
          >
            <X className="h-3 w-3 text-red-600 dark:text-red-400" />
          </Button>
        </div>
      ) : (
        <div
          className={`cursor-pointer hover:bg-muted p-1 rounded transition-colors ${getScoreColor(value)} ${className}`}
          onClick={() => setIsEditing(true)}
          title="Click to edit score"
        >
          {value}
        </div>
      )}
    </div>
  );
}
