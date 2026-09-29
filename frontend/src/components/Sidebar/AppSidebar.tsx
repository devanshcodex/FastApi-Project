import { Bell, FolderKanban, Home, Settings, ShieldCheck } from "lucide-react"

import { SidebarAppearance } from "@/components/Common/Appearance"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar"
import useAuth from "@/hooks/useAuth"
import { Main, type Item } from "./Main"
import { User } from "./User"

const baseItems: Item[] = [
  { icon: Home, title: "Dashboard", path: "/" },
  { icon: FolderKanban, title: "Projects", path: "/projects" },
  { icon: Bell, title: "Notifications", path: "/notifications" },
  { icon: Settings, title: "Settings", path: "/settings" },
]

export function AppSidebar() {
  const { user: currentUser } = useAuth()

  const items = currentUser?.is_superuser
    ? [...baseItems, { icon: ShieldCheck, title: "Admin", path: "/admin" }]
    : baseItems

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-6 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
        <div className="font-bold tracking-tight group-data-[collapsible=icon]:hidden">
          Task<span className="text-primary">Flow</span>
        </div>
        <div className="hidden text-lg font-bold group-data-[collapsible=icon]:block">T</div>
      </SidebarHeader>
      <SidebarContent>
        <Main items={items} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarAppearance />
        <User user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
