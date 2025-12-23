"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Machine {
  id: string
  machine_code: string
  machine_name: string
  machine_type: string
  location: string | null
  purchase_date: string | null
  maintenance_schedule: string | null
  status: string
}

export function MachinesTable({ machines }: { machines: Machine[] }) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this machine?")) return

    const supabase = createClient()
    const { error } = await supabase.from("machines").delete().eq("id", id)

    if (error) {
      alert("Error deleting machine: " + error.message)
    } else {
      router.refresh()
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "under_maintenance":
        return "secondary"
      case "inactive":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Purchase Date</TableHead>
            <TableHead>Maintenance Schedule</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {machines.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                No machines found. Add your first machine to get started.
              </TableCell>
            </TableRow>
          ) : (
            machines.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell className="font-mono text-sm">{machine.machine_code}</TableCell>
                <TableCell className="font-medium">{machine.machine_name}</TableCell>
                <TableCell>{machine.machine_type}</TableCell>
                <TableCell>{machine.location || "-"}</TableCell>
                <TableCell>
                  {machine.purchase_date ? new Date(machine.purchase_date).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell className="max-w-xs truncate">{machine.maintenance_schedule || "-"}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(machine.status)}>{machine.status.replace("_", " ")}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/machines/${machine.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(machine.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
