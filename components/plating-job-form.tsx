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

interface JobCard {
  id: string
  job_card_number: string
}

interface Part {
  id: string
  part_code: string
  part_name: string
}

interface PlatingJobFormProps {
  jobCards: JobCard[]
  parts: Part[]
  platingJob?: any
}

export function PlatingJobForm({ jobCards, parts, platingJob }: PlatingJobFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    plating_job_number: platingJob?.plating_job_number || "",
    job_card_id: platingJob?.job_card_id || "",
    part_id: platingJob?.part_id || "",
    plating_type: platingJob?.plating_type || "nickel",
    quantity: platingJob?.quantity?.toString() || "1",
    weight_kg: platingJob?.weight_kg?.toString() || "",
    tank_number: platingJob?.tank_number || "",
    current_ampere: platingJob?.current_ampere?.toString() || "",
    voltage: platingJob?.voltage?.toString() || "",
    temperature_celsius: platingJob?.temperature_celsius?.toString() || "",
    status: platingJob?.status || "pending",
    quality_check_status: platingJob?.quality_check_status || "pending",
    notes: platingJob?.notes || "",
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
      quantity: Number.parseInt(formData.quantity),
      weight_kg: formData.weight_kg ? Number.parseFloat(formData.weight_kg) : null,
      current_ampere: formData.current_ampere ? Number.parseFloat(formData.current_ampere) : null,
      voltage: formData.voltage ? Number.parseFloat(formData.voltage) : null,
      temperature_celsius: formData.temperature_celsius ? Number.parseFloat(formData.temperature_celsius) : null,
    }

    let error
    if (platingJob) {
      const result = await supabase.from("plating_jobs").update(data).eq("id", platingJob.id)
      error = result.error
    } else {
      const result = await supabase.from("plating_jobs").insert([data])
      error = result.error
    }

    if (error) {
      alert("Error saving plating job: " + error.message)
      setIsLoading(false)
    } else {
      router.push("/dashboard/plating")
      router.refresh()
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{platingJob ? "Edit Plating Job" : "New Plating Job"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plating_job_number">Plating Job Number *</Label>
              <Input
                id="plating_job_number"
                required
                value={formData.plating_job_number}
                onChange={(e) => setFormData({ ...formData, plating_job_number: e.target.value })}
                placeholder="PLT-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job_card_id">Job Card</Label>
              <Select
                value={formData.job_card_id}
                onValueChange={(value) => setFormData({ ...formData, job_card_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job card" />
                </SelectTrigger>
                <SelectContent>
                  {jobCards.map((jobCard) => (
                    <SelectItem key={jobCard.id} value={jobCard.id}>
                      {jobCard.job_card_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="part_id">Part</Label>
              <Select value={formData.part_id} onValueChange={(value) => setFormData({ ...formData, part_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select part" />
                </SelectTrigger>
                <SelectContent>
                  {parts.map((part) => (
                    <SelectItem key={part.id} value={part.id}>
                      {part.part_name} ({part.part_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plating_type">Plating Type *</Label>
              <Select
                value={formData.plating_type}
                onValueChange={(value) => setFormData({ ...formData, plating_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nickel">Nickel</SelectItem>
                  <SelectItem value="chrome">Chrome</SelectItem>
                  <SelectItem value="zinc">Zinc</SelectItem>
                  <SelectItem value="copper">Copper</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight_kg">Weight (kg)</Label>
              <Input
                id="weight_kg"
                type="number"
                step="0.001"
                value={formData.weight_kg}
                onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                placeholder="10.500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tank_number">Tank Number</Label>
              <Input
                id="tank_number"
                value={formData.tank_number}
                onChange={(e) => setFormData({ ...formData, tank_number: e.target.value })}
                placeholder="TANK-01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_ampere">Current (A)</Label>
              <Input
                id="current_ampere"
                type="number"
                step="0.01"
                value={formData.current_ampere}
                onChange={(e) => setFormData({ ...formData, current_ampere: e.target.value })}
                placeholder="15.50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voltage">Voltage (V)</Label>
              <Input
                id="voltage"
                type="number"
                step="0.01"
                value={formData.voltage}
                onChange={(e) => setFormData({ ...formData, voltage: e.target.value })}
                placeholder="12.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature_celsius">Temperature (°C)</Label>
              <Input
                id="temperature_celsius"
                type="number"
                step="0.01"
                value={formData.temperature_celsius}
                onChange={(e) => setFormData({ ...formData, temperature_celsius: e.target.value })}
                placeholder="25.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_process">In Process</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="rework">Rework</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quality_check_status">Quality Check</Label>
              <Select
                value={formData.quality_check_status}
                onValueChange={(value) => setFormData({ ...formData, quality_check_status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : platingJob ? "Update Plating Job" : "Create Plating Job"}
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
