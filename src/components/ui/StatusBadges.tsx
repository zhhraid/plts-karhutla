import {
  AlertTriangle,
  CircleHelp,
  GraduationCap,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import { Badge, type BadgeTone } from "@/components/ui/Badge";
import {
  CONFIDENCE_LABEL,
  PRIORITY_BAND_LABEL,
  RECOMMENDATION_LABEL,
  SCORE_STATUS_LABEL,
} from "@/lib/scoring/interpret";
import type {
  DataConfidenceLevel,
  FacilityType,
  PriorityBand,
  RecommendationType,
  ScoreStatus,
} from "@/types";

/**
 * Status chips used across dashboard, map and detail.
 *
 * Each one pairs a colour with a written label and, where it carries a warning,
 * an icon. Nothing in this product is distinguishable by colour alone.
 */

const BAND_TONE: Readonly<Record<PriorityBand, BadgeTone>> = {
  HIGH: "warning",
  MEDIUM: "info",
  LOW: "neutral",
  NEEDS_VERIFICATION: "unverified",
};

export function PriorityBadge({ band }: { readonly band: PriorityBand }) {
  return (
    <Badge tone={BAND_TONE[band]}>
      {band === "NEEDS_VERIFICATION" ? <CircleHelp aria-hidden className="h-3 w-3" /> : null}
      {PRIORITY_BAND_LABEL[band]}
    </Badge>
  );
}

const CONFIDENCE_TONE: Readonly<Record<DataConfidenceLevel, BadgeTone>> = {
  HIGH: "success",
  MEDIUM: "warning",
  NEEDS_VERIFICATION: "unverified",
};

export function ConfidenceBadge({ level }: { readonly level: DataConfidenceLevel }) {
  return (
    <Badge tone={CONFIDENCE_TONE[level]}>
      {level === "HIGH" ? (
        <ShieldCheck aria-hidden className="h-3 w-3" />
      ) : (
        <AlertTriangle aria-hidden className="h-3 w-3" />
      )}
      {CONFIDENCE_LABEL[level]}
    </Badge>
  );
}

export function ScoreStatusBadge({ status }: { readonly status: ScoreStatus }) {
  // Only a fully covered score is presented without a caution tone.
  const tone: BadgeTone =
    status === "FINAL_ENOUGH_FOR_MVP" ? "success" : "warning";
  return (
    <Badge tone={tone}>
      {status === "FINAL_ENOUGH_FOR_MVP" ? null : (
        <AlertTriangle aria-hidden className="h-3 w-3" />
      )}
      {SCORE_STATUS_LABEL[status]}
    </Badge>
  );
}

export function RecommendationBadge({ type }: { readonly type: RecommendationType }) {
  const tone: BadgeTone =
    type === "NEW_DEPLOYMENT_ASSESSMENT" || type === "EXPANSION_ASSESSMENT"
      ? "info"
      : "unverified";
  return <Badge tone={tone}>{RECOMMENDATION_LABEL[type]}</Badge>;
}

/** Facility type carries its own icon so the map is readable without colour. */
export function FacilityTypeBadge({ type }: { readonly type: FacilityType }) {
  return (
    <Badge tone="neutral">
      {type === "Puskesmas" ? (
        <Stethoscope aria-hidden className="h-3 w-3" />
      ) : (
        <GraduationCap aria-hidden className="h-3 w-3" />
      )}
      {type}
    </Badge>
  );
}
