/**
 * Teams page.
 */

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DeleteTeamDialog } from "../components/DeleteTeamDialog";
import { TeamFilters } from "../components/TeamFilters";
import { TeamTable } from "../components/TeamTable";
import { useTeams } from "../hooks/useTeams";

import type {
  Team,
} from "../types/team.types";

/**
 * Teams page.
 */
export function TeamsPage(): React.JSX.Element {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const [selectedTeam, setSelectedTeam] =
    useState<Team>();

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const {
    data,
    isLoading,
    error,
  } = useTeams();

  const teams = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.items.filter((team) => {
      const matchesSearch =
        team.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "all"
          ? true
          : status === "active"
            ? team.isActive
            : !team.isActive;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, status]);

  function handleDelete(
    team: Team,
  ): void {
    setSelectedTeam(team);
    setDeleteDialogOpen(true);
  }

  function confirmDelete(): void {
    console.log(
      "Delete team:",
      selectedTeam?.id,
    );

    setDeleteDialogOpen(false);
  }

  if (isLoading) {
    return (
      <div className="p-8">
        Loading teams...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600">
        Failed to load teams.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Teams
        </h1>

        <button
          type="button"
          onClick={() =>
            navigate("/teams/create")
          }
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          New Team
        </button>
      </div>

      <TeamFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />

      <TeamTable
        teams={teams}
        onView={(team) =>
          navigate(`/teams/${team.id}`)
        }
        onEdit={(team) =>
          navigate(`/teams/${team.id}/edit`)
        }
        onDelete={handleDelete}
      />

      <DeleteTeamDialog
        open={deleteDialogOpen}
        team={selectedTeam}
        onCancel={() =>
          setDeleteDialogOpen(false)
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}