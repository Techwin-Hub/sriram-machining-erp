"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Building2,
  Truck,
  Cog,
  Package,
  ClipboardList,
  Clock,
  DollarSign,
  FileText,
  Beaker,
  FileCheck,
  Receipt,
  ShoppingCart,
  BarChart3,
  Factory,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Master Data",
    items: [
      { href: "/dashboard/employees", label: "Employees", icon: Users },
      { href: "/dashboard/customers", label: "Customers", icon: Building2 },
      { href: "/dashboard/vendors", label: "Vendors", icon: Truck },
      { href: "/dashboard/machines", label: "Machines", icon: Cog },
      { href: "/dashboard/parts", label: "Parts", icon: Package },
      { href: "/dashboard/operations", label: "Operations", icon: ClipboardList },
    ],
  },
  {
    label: "HR & Payroll",
    items: [
      { href: "/dashboard/attendance", label: "Attendance", icon: Clock },
      { href: "/dashboard/payroll", label: "Payroll", icon: DollarSign },
    ],
  },
  {
    label: "Production",
    items: [
      { href: "/dashboard/job-cards", label: "Job Cards", icon: FileText },
      { href: "/dashboard/plating", label: "Plating Jobs", icon: Beaker },
    ],
  },
  {
    label: "Sales & Billing",
    items: [
      { href: "/dashboard/delivery-challans", label: "Delivery Challans", icon: FileCheck },
      { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
    ],
  },
  {
    label: "Purchase & Reports",
    items: [
      { href: "/dashboard/purchase-orders", label: "Purchase Orders", icon: ShoppingCart },
      { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
    ],
  },
]

export function NavSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Factory className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Manufacturing ERP</span>
        </div>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {navItems.map((item, idx) => {
            if ("href" in item) {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            }

            return (
              <div key={idx}>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                  {item.label}
                </div>
                <div className="space-y-1">
                  {item.items.map((subItem) => {
                    const Icon = subItem.icon
                    const isActive = pathname === subItem.href
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {subItem.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
