import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft, CheckCircle2, Circle, Clock3, Plus } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Project = { id: string; name: string; description?: string | null }
type Task = { id: string; title: string; status: "todo" | "in_progress" | "review" | "done"; priority: string; due_date?: string | null }

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("access_token")
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options?.headers },
  })
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail || "Request failed")
  return response.json()
}

export const Route = createFileRoute("/_layout/projects/$projectId")({
  component: ProjectDetail,
  head: () => ({ meta: [{ title: "Project - TaskFlow" }] }),
})

function ProjectDetail() {
  const { projectId } = Route.useParams()
  const [title, setTitle] = useState("")
  const queryClient = useQueryClient()
  const projectQuery = useQuery({ queryKey: ["taskflow-project", projectId], queryFn: () => api<Project>(`/api/v1/projects/${projectId}`) })
  const tasksQuery = useQuery({ queryKey: ["taskflow-tasks", projectId], queryFn: () => api<{ data: Task[]; count: number }>(`/api/v1/tasks/?project_id=${projectId}`) })
  const createTask = useMutation({
    mutationFn: () => api<Task>("/api/v1/tasks/", { method: "POST", body: JSON.stringify({ title, project_id: projectId, priority: "medium", status: "todo" }) }),
    onSuccess: () => { setTitle(""); queryClient.invalidateQueries({ queryKey: ["taskflow-tasks", projectId] }) },
  })
  const tasks = tasksQuery.data?.data ?? []
  const columns = [
    { key: "todo", label: "To do", icon: Circle },
    { key: "in_progress", label: "In progress", icon: Clock3 },
    { key: "review", label: "Review", icon: Clock3 },
    { key: "done", label: "Done", icon: CheckCircle2 },
  ] as const

  if (projectQuery.isPending) return <p className="text-muted-foreground">Loading project...</p>
  if (projectQuery.isError || !projectQuery.data) return <p className="text-destructive">Project not found.</p>

  return (
    <div className="space-y-8">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Back to projects</Link>
      <section>
        <p className="text-sm font-medium text-primary">Project workspace</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{projectQuery.data.name}</h1>
        <p className="mt-2 text-muted-foreground">{projectQuery.data.description || "No project description."}</p>
      </section>
      <Card>
        <CardContent className="flex gap-3 pt-6">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task..." onKeyDown={(e) => { if (e.key === "Enter" && title.trim()) createTask.mutate() }} className="h-10 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          <Button disabled={!title.trim() || createTask.isPending} onClick={() => createTask.mutate()}><Plus /> Add task</Button>
        </CardContent>
      </Card>
      <div className="grid gap-4 xl:grid-cols-4">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.key)
          const Icon = column.icon
          return (
            <Card key={column.key} className="min-h-56">
              <CardHeader className="pb-3"><CardTitle className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><Icon className="size-4" /> {column.label}</span><span className="rounded-full bg-muted px-2 py-0.5 text-xs">{columnTasks.length}</span></CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {columnTasks.map((task) => <div key={task.id} className="rounded-lg border bg-card p-3 shadow-sm"><p className="font-medium text-sm">{task.title}</p><p className="mt-1 text-xs capitalize text-muted-foreground">{task.priority} priority</p></div>)}
                {columnTasks.length === 0 && <p className="py-4 text-center text-xs text-muted-foreground">No tasks</p>}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
