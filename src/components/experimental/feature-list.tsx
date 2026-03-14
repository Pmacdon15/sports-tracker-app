"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { ExperimentalFeature } from "@/db/types";
import { useUpdateExperimentalFeatureMutation } from "@/mutations/experimental";

interface FeatureListProps {
  initialFeatures: (ExperimentalFeature & { description: string | null })[];
  isAdmin: boolean;
}

export function FeatureList({ initialFeatures, isAdmin }: FeatureListProps) {
  const [features, setFeatures] =
    useState<(ExperimentalFeature & { description: string | null })[]>(
      initialFeatures,
    );
  const mutation = useUpdateExperimentalFeatureMutation();

  const handleToggle = async (featureName: string, isEnabled: boolean) => {
    try {
      const feature = features.find((f) => f.feature_name === featureName);
      if (!feature) return;

      await mutation.mutateAsync({
        featureName,
        isEnabled,
        apiKey: feature.api_key,
      });

      setFeatures((prev) =>
        prev.map((f) =>
          f.feature_name === featureName ? { ...f, is_enabled: isEnabled } : f,
        ),
      );
      toast.success(`${featureName} ${isEnabled ? "enabled" : "disabled"}`);
    } catch (_error) {
      toast.error("Failed to update feature state");
    }
  };

  const handleApiKeyChange = (featureName: string, apiKey: string) => {
    setFeatures((prev) =>
      prev.map((f) =>
        f.feature_name === featureName ? { ...f, api_key: apiKey } : f,
      ),
    );
  };

  const handleApiKeyBlur = async (featureName: string, apiKey: string) => {
    try {
      const feature = features.find((f) => f.feature_name === featureName);
      if (!feature) return;

      await mutation.mutateAsync({
        featureName,
        isEnabled: feature.is_enabled,
        apiKey,
      });
      toast.success(`API key for ${featureName} updated`);
    } catch (_error) {
      toast.error("Failed to update API key");
    }
  };

  return (
    <div className="grid gap-6">
      {features.map((feature) => (
        <Card key={feature.feature_name}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl capitalize">
                {feature.feature_name}
              </CardTitle>
              <CardDescription>
                {feature.description ||
                  `Experimental feature for organization: ${feature.org_id}`}
              </CardDescription>
            </div>
            <Switch
              disabled={!isAdmin || mutation.isPending}
              checked={feature.is_enabled}
              onCheckedChange={(checked) =>
                handleToggle(feature.feature_name, checked)
              }
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${feature.feature_name}-api-key`}>API Key</Label>
              <Input
                id={`${feature.feature_name}-api-key`}
                type="password"
                placeholder="Enter API Key"
                value={feature.api_key || ""}
                disabled={!isAdmin || mutation.isPending}
                onChange={(e) =>
                  handleApiKeyChange(feature.feature_name, e.target.value)
                }
                onBlur={(e) =>
                  handleApiKeyBlur(feature.feature_name, e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>
      ))}
      {features.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/20">
          No experimental features found for this organization.
        </div>
      )}
    </div>
  );
}
