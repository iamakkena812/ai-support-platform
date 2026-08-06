/**
 * Edit team page.
 */

import { useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { TeamForm } from "../components/TeamForm";
import { useTeam } from "../hooks/useTeam";
import { TeamService } from "../services/team.service";

import type {
  CreateTeamRequest,
} from "../types/team.types";

/**
 * Edit team page.
 */
export function EditTeamPage(): React.JSX.Element {
  const navigate = useNavigate();

  const { teamId = "" } = useParams<{
    teamId: string;
  }>();

  const {
    data,
    isLoading,
    error,
  } = useTeam(teamId);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /**
   * Handles form submission.
   */
  async function handleSubmit(
    values: CreateTeamRequest,
  ): Promise<void> {
    try {
      setIsSubmitting(true);

      await TeamService.updateTeam(
        teamId,
        values,
      );

      navigate("/teams");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        Loading team...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600">
        Failed to load team.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        Team not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">
          Edit Team
        </h1>

        <p className="mt-2 text-slate-600">
          Update team information.
        </p>
      </div>

      <TeamForm
        initialValues={data.team}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}