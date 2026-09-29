import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { CheckCircle2, CircleDot, FolderKanban, ListTodo, Plus, TriangleAlert } from "lucide-react"

import useAuth from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Project = {
  id: string
  name: string
  description?: string | null
  created_at: string
}

type Task = {
  id: string
  title: string
  status: "todo" | "in_progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "urgent"
  due_date?: string | null
  project_id: string
}

async function api<T>(path: string): Promise<T> {
  const token = localStorage.getItem("access_token")
  const response = await fetch(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!response.ok) throw new Error("Unable to load dashboard data")
  return response.json()
}

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
  head: () => ({
    meta: [{ title: "Dashboard - TaskFlow" }],
  }),
})

function Dashboard() {
  const { user } = useAuth()
  const projectsQuery = useQuery({
    queryKey: ["taskflow-projects"],
    queryFn: () => api<{ data: Project[]; count: number }>("/api/v1/projects/"),
  })
  const tasksQuery = useQuery({
    queryKey: ["taskflow-tasks"],
    queryFn: () => api<{ data: Task[]; count: number }>("/api/v1/tasks/"),
  })

  const projects = projectsQuery.data?.data ?? []
  const tasks = tasksQuery.data?.data ?? []
  const completed = tasks.filter((task) => task.status === "done").length
  const inProgress = tasks.filter((task) => task.status === "in_progress").length
  const overdue = tasks.filter(
    (task) => task.due_date && new Date(task.due_date) < new Date() && task.status !== "done",
  ).length

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">TaskFlow workspace</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Welcome back, {user?.full_name || user?.email}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Keep projects moving and know what needs your attention today.
          </p>
        </div>
        <Button asChild>
          <Link to="/projects">
            <Plus /> New project
          </Link>
        </Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={FolderKanban} label="Projects" value={projectsQuery.data?.count ?? 0} />
        <MetricCard icon={ListTodo} label="Open tasks" value={tasks.length - completed} />
        <MetricCard icon={CircleDot} label="In progress" value={inProgress} />
        <MetricCard icon={TriangleAlert} label="Overdue" value={overdue} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent projects</CardTitle>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <EmptyState text="No projects yet. Create your first project to get started." />
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <Link
                    key={project.id}
                    to="/projects/$projectId"
                    params={{ projectId: project.id }}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        {project.description || "No description"}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">Open →</span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <ProgressRow label="Completed" value={completed} total={tasks.length} icon={CheckCircle2} />
              <ProgressRow label="In progress" value={inProgress} total={tasks.length} icon={CircleDot} />
              <ProgressRow label="Remaining" value={tasks.length - completed} total={tasks.length} icon={ListTodo} />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FolderKanban
  label: string
  value: number
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className="rounded-lg bg-primary/10 p-3 text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ProgressRow({
  label,
  value,
  total,
  icon: Icon,
}: {
  label: string
  value: number
  total: number
  icon: typeof CheckCircle2
}) {
  const percentage = total ? Math.round((value / total) * 100) : 0
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2"><Icon className="size-4 text-muted-foreground" />{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">{text}</p>
}
