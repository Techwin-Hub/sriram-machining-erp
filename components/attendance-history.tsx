"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Clock } from "lucide-react"
import Link from "next/link"

interface AttendanceRecord {
  id: string
  date: string
  check_in: string | null
  check_out: string | null
  status_code: string
  ot_hours: number
  notes: string | null
  employees: {
    employee_code: string
    name: string
    designation: string
    department: string
  }
}

interface GroupedAttendance {
  [date: string]: AttendanceRecord[]
}

export function AttendanceHistory({ attendance }: { attendance: AttendanceRecord[] }) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "S":
        return "destructive"
      case "X":
        return "default"
      case "SL":
      case "PC":
        return "secondary"
      case "L":
        return "outline"
      default:
        return "default"
    }
  }

  const groupedAttendance = attendance.reduce((acc, record) => {
    const date = record.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(record)
    return acc
  }, {} as GroupedAttendance)

  return (
    <div className="space-y-6">
      {Object.keys(groupedAttendance).length === 0 ? (
        <p className="text-center text-muted-foreground">No attendance records found.</p>
      ) : (
        Object.keys(groupedAttendance)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
          .map((date) => (
            <div key={date}>
              <h2 className="text-lg font-semibold mb-2">{new Date(date).toLocaleDateString()}</h2>
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Employee Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>OT Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedAttendance[date].map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono text-sm">{record.employees.employee_code}</TableCell>
                        <TableCell>{record.employees.name}</TableCell>
                        <TableCell>{record.employees.department}</TableCell>
                        <TableCell>{record.check_in || "-"}</TableCell>
                        <TableCell>{record.check_out || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {record.ot_hours > 0 && <Clock className="h-3 w-3 text-accent" />}
                            <span>{record.ot_hours}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(record.status_code)}>{record.status_code}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/attendance/edit/${record.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))
      )}
    </div>
  )
}
