import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { FolderKanban, Plus } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type Project = { id: string; name: string; description?: string | null; created_at: string }

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("access_token")
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options?.headers },
  })
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail || "Request failed")
  return response.json()
}

export const Route = createFileRoute("/_layout/projects")({
  component: Projects,
  head: () => ({ meta: [{ title: "Projects - TaskFlow" }] }),
})

function Projects() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const queryClient = useQueryClient()
  const projectsQuery = useQuery({
    queryKey: ["taskflow-projects"],
    queryFn: () => api<{ data: Project[]; count: number }>("/api/v1/projects/"),
  })
  const createProject = useMutation({
    mutationFn: () => api<Project>("/api/v1/projects/", {
      method: "POST",
      body: JSON.stringify({ name, description: description || null }),
    }),
    onSuccess: () => {
      setName("")
      setDescription("")
      queryClient.invalidateQueries({ queryKey: ["taskflow-projects"] })
    },
  })
  const projects = projectsQuery.data?.data ?? []

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-primary">Workspace</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Projects</h1>
        <p className="mt-2 text-muted-foreground">Organize work into focused project spaces.</p>
      </section>
      <Card>
        <CardContent className="grid gap-3 pt-6 md:grid-cols-[1fr_1fr_auto]">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          <Button disabled={!name.trim() || createProject.isPending} onClick={() => createProject.mutate()}>
            <Plus /> {createProject.isPending ? "Creating..." : "Create project"}
          </Button>
        </CardContent>
      </Card>
      {projectsQuery.isPending ? <p className="text-muted-foreground">Loading projects...</p> :
       projectsQuery.isError ? <p className="text-destructive">Unable to load projects.</p> :
       projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <div className="rounded-full bg-primary/10 p-4 text-primary"><FolderKanban /></div>
          <h2 className="mt-4 text-lg font-semibold">No projects yet</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">Create your first project above and start turning ideas into trackable tasks.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} to="/projects/$projectId" params={{ projectId: project.id }}>
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-lg bg-primary/10 p-2.5 text-primary"><FolderKanban className="size-5" /></div>
                    <span className="text-xs text-muted-foreground">Open →</span>
                  </div>
                  <h2 className="mt-5 font-semibold">{project.name}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.description || "No description provided."}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
