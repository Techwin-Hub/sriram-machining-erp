"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Clock } from "lucide-react"
import Link from "next/link"
import { attendanceStatusCodes } from "@/lib/constants"

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
    ot_rate_per_hour: number | null
  }
}

export function AttendanceTable({ attendance }: { attendance: AttendanceRecord[] }) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "S":
        return "default"
      case "X":
        return "destructive"
      case "SL":
      case "L":
      case "PC":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusDescription = (code: string) => {
    return attendanceStatusCodes[code as keyof typeof attendanceStatusCodes] || "Unknown"
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Employee Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>OT Hours</TableHead>
            <TableHead>OT Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center text-muted-foreground">
                No attendance records for today. Start marking attendance.
              </TableCell>
            </TableRow>
          ) : (
            attendance.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-mono text-sm">{record.employees.employee_code}</TableCell>
                <TableCell className="font-medium">{record.employees.name}</TableCell>
                <TableCell>{record.employees.designation}</TableCell>
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
                  {(
                    record.ot_hours * (record.employees.ot_rate_per_hour || 0)
                  ).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(record.status_code)}>
                    {record.status_code} - {getStatusDescription(record.status_code)}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{record.notes || "-"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/attendance/${record.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
