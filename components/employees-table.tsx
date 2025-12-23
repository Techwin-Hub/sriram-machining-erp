"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Employee {
  id: string
  employee_code: string
  name: string
  designation: string
  department: string
  date_of_joining: string
  phone: string | null
  salary_per_day: number | null
  status: string
}

export function EmployeesTable({ employees }: { employees: Employee[] }) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return

    const supabase = createClient()
    const { error } = await supabase.from("employees").delete().eq("id", id)

    if (error) {
      alert("Error deleting employee: " + error.message)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Joining Date</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Daily Rate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No employees found. Add your first employee to get started.
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-mono text-sm">{employee.employee_code}</TableCell>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.designation}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{new Date(employee.date_of_joining).toLocaleDateString()}</TableCell>
                <TableCell>{employee.phone || "-"}</TableCell>
                <TableCell>{employee.salary_per_day ? `₹${employee.salary_per_day}` : "-"}</TableCell>
                <TableCell>
                  <Badge variant={employee.status === "active" ? "default" : "secondary"}>{employee.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/employees/${employee.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(employee.id)}>
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
