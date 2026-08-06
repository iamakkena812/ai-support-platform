/**
 * Create team page.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { TeamForm } from "../components/TeamForm";
import { TeamService } from "../services/team.service";

import type {
  CreateTeamRequest,
} from "../types/team.types";

/**
 * Create team page.
 */
export function CreateTeamPage(): React.JSX.Element {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] =
    useState(false);

  /**
   * Handles form submission.
   */
  async function handleSubmit(
    values: CreateTeamRequest,
  ): Promise<void> {
    try {
      setIsLoading(true);

      await TeamService.createTeam(
        values,
      );

      navigate("/teams");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">
          Create Team
        </h1>

        <p className="mt-2 text-slate-600">
          Create a new team.
        </p>
      </div>

      <TeamForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}