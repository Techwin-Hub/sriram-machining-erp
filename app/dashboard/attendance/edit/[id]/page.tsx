import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { notFound } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { revalidatePath } from "next/cache"

interface EditAttendancePageProps {
  params: {
    id: string
  }
}

export default async function EditAttendancePage({ params }: EditAttendancePageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: attendanceRecord } = await supabase
    .from("attendance")
    .select(
      `
      *,
      employees:employee_id (
        name
      )
    `,
    )
    .eq("id", params.id)
    .single()

  if (!attendanceRecord) {
    notFound()
  }

  async function updateAttendance(formData: FormData) {
    "use server"

    const supabase = await createClient()

    const { error } = await supabase
      .from("attendance")
      .update({
        status_code: formData.get("status_code") as string,
        ot_hours: Number(formData.get("ot_hours")),
        notes: formData.get("notes") as string,
      })
      .eq("id", params.id)

    if (error) {
      console.error("Error updating attendance:", error)
      // Optionally, redirect to an error page or show a message
    } else {
      revalidatePath("/dashboard/attendance/history")
      redirect("/dashboard/attendance/history")
    }
  }

  return (
    <div>
      <DashboardHeader
        title="Edit Attendance"
        description={`Editing record for ${attendanceRecord.employees?.name} on ${new Date(
          attendanceRecord.date,
        ).toLocaleDateString()}`}
      />
      <div className="p-6">
        <form action={updateAttendance}>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Details</CardTitle>
              <CardDescription>Update the attendance record below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status_code">Attendance Status</Label>
                  <Select name="status_code" defaultValue={attendanceRecord.status_code}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="X">Present (Paid)</SelectItem>
                      <SelectItem value="S">Weekly Off (Unpaid)</SelectItem>
                      <SelectItem value="SL">Paid Leave</SelectItem>
                      <SelectItem value="L">Leave (Unpaid)</SelectItem>
                      <SelectItem value="PC">Special Present (Paid)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ot_hours">OT Hours</Label>
                  <Input
                    id="ot_hours"
                    name="ot_hours"
                    type="number"
                    step="0.1"
                    defaultValue={attendanceRecord.ot_hours}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" name="notes" defaultValue={attendanceRecord.notes || ""} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
