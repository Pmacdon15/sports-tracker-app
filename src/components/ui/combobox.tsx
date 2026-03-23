"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ComboboxProps {
  options: { label: string; value: string }[];
  value: string;
  onValueChange: (val: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  allowCustom?: boolean;
  disabled?: boolean;
}

export function Combobox({
  options,
  value,
  onValueChange,
  onBlur,
  placeholder = "Select option...",
  allowCustom = false,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  return (
    <Popover 
      open={open} 
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen && onBlur) onBlur(); // Mark as touched when closed
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          onBlur={onBlur}
          className={cn(
            "w-full justify-between font-normal transition-all",
            !value && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed bg-muted"
          )}
        >
          <span className="truncate">
            {value
              ? options.find((option) => option.value === value)?.label || value
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty className="p-1">
              {allowCustom && inputValue.trim() !== "" ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 px-2 py-1.5 text-sm font-normal"
                  onClick={() => {
                    onValueChange(inputValue.trim());
                    setOpen(false);
                    setInputValue("");
                  }}
                >
                  <Plus className="h-3 w-3" />
                  <span className="truncate text-primary font-medium">Create "{inputValue}"</span>
                </Button>
              ) : (
                <p className="p-4 text-center text-sm text-muted-foreground">No results found.</p>
              )}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}