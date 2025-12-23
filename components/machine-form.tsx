"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface MachineFormProps {
  machine?: {
    id: string
    machine_code: string
    machine_name: string
    machine_type: string
    location: string | null
    purchase_date: string | null
    maintenance_schedule: string | null
    status: string
  }
}

export function MachineForm({ machine }: MachineFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    machine_code: machine?.machine_code || "",
    machine_name: machine?.machine_name || "",
    machine_type: machine?.machine_type || "",
    location: machine?.location || "",
    purchase_date: machine?.purchase_date || "",
    maintenance_schedule: machine?.maintenance_schedule || "",
    status: machine?.status || "active",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("You must be logged in")
      return
    }

    const data = {
      ...formData,
      user_id: user.id,
    }

    let error
    if (machine) {
      const result = await supabase.from("machines").update(data).eq("id", machine.id)
      error = result.error
    } else {
      const result = await supabase.from("machines").insert([data])
      error = result.error
    }

    if (error) {
      alert("Error saving machine: " + error.message)
      setIsLoading(false)
    } else {
      router.push("/dashboard/machines")
      router.refresh()
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{machine ? "Edit Machine" : "New Machine"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="machine_code">Machine Code *</Label>
              <Input
                id="machine_code"
                required
                value={formData.machine_code}
                onChange={(e) => setFormData({ ...formData, machine_code: e.target.value })}
                placeholder="MCH-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="machine_name">Machine Name *</Label>
              <Input
                id="machine_name"
                required
                value={formData.machine_name}
                onChange={(e) => setFormData({ ...formData, machine_name: e.target.value })}
                placeholder="CNC Lathe 1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="machine_type">Machine Type *</Label>
              <Input
                id="machine_type"
                required
                value={formData.machine_type}
                onChange={(e) => setFormData({ ...formData, machine_type: e.target.value })}
                placeholder="Lathe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Shop Floor A"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchase_date">Purchase Date</Label>
              <Input
                id="purchase_date"
                type="date"
                value={formData.purchase_date}
                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenance_schedule">Maintenance Schedule</Label>
            <Textarea
              id="maintenance_schedule"
              value={formData.maintenance_schedule}
              onChange={(e) => setFormData({ ...formData, maintenance_schedule: e.target.value })}
              placeholder="Enter maintenance schedule details"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : machine ? "Update Machine" : "Create Machine"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
