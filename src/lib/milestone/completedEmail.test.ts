import { describe, expect, it } from "vitest";
import { buildMilestoneCompletedEmail } from "./completedEmail";

const project = {
  name: "Ana Pérez",
  projectCode: "ABC123",
  planName: "Landing Page",
  accessToken: "token-123",
};

const completedAt = new Date("2026-10-25T15:00:00Z");

const milestones = [
  { id: "m2", title: "Design", description: null, order: 1, status: "completed" as const, completedAt },
  { id: "m1", title: "Kickoff", description: "First call", order: 0, status: "completed" as const, completedAt },
  { id: "m3", title: "Build", description: null, order: 2, status: "in_progress" as const, completedAt: null },
  { id: "m4", title: "Launch", description: null, order: 3, status: "pending" as const, completedAt: null },
];

describe("buildMilestoneCompletedEmail", () => {
  it("describes the completed milestone, the progress and the ordered list", () => {
    const result = buildMilestoneCompletedEmail(project, milestones, "m2");
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data).toMatchObject({
      customerName: "Ana Pérez",
      projectCode: "ABC123",
      planName: "Landing Page",
      milestoneTitle: "Design",
      milestoneDescription: null,
      completedAt,
      completedCount: 2,
      totalCount: 4,
    });
    expect(result.data.milestones.map((m) => m.title)).toEqual(["Kickoff", "Design", "Build", "Launch"]);
    expect(result.data.projectUrl).toMatch(/\/project\/token-123$/);
  });

  it("refuses a milestone that is not completed", () => {
    const result = buildMilestoneCompletedEmail(project, milestones, "m3");
    expect(result).toEqual({
      ok: false,
      error: "Only completed milestones are announced to the customer",
    });
  });

  it("refuses an unknown milestone", () => {
    expect(buildMilestoneCompletedEmail(project, milestones, "nope")).toEqual({
      ok: false,
      error: "Milestone not found",
    });
  });

  it("falls back to now when a completed milestone has no completedAt", () => {
    const before = Date.now();
    const result = buildMilestoneCompletedEmail(
      project,
      [{ ...milestones[0], completedAt: null }],
      "m2"
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.completedAt.getTime()).toBeGreaterThanOrEqual(before);
  });
});
