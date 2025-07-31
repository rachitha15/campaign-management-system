import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, FileText } from "lucide-react";

const programSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  purpose: z.string().min(1, "Purpose is required"),
  inputType: z.enum(["file", "api"]),
  expiryDays: z.number().min(1, "Expiry days must be at least 1"),
  minimumOrderValue: z.number().optional(),
  fileFormatId: z.string().optional(),
  
  // User limits (moved from campaign settings)
  enableUserLimits: z.boolean().default(false),
  maxUsagePerUser: z.number().optional(),
  limitPeriod: z.enum(["day", "week", "month", "lifetime"]).optional(),
  cooldownPeriod: z.number().optional(),
  cooldownUnit: z.enum(["hours", "days"]).optional()
});

type ProgramFormData = z.infer<typeof programSchema>;

interface ProgramCreationStepProps {
  onNext: (data: ProgramFormData) => void;
  onBack: () => void;
  initialData?: Partial<ProgramFormData>;
}

export function ProgramCreationStep({ onNext, onBack, initialData }: ProgramCreationStepProps) {
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: "",
      purpose: "",
      inputType: "file",
      expiryDays: 30,
      minimumOrderValue: undefined,
      fileFormatId: "format_1",
      enableUserLimits: false,
      maxUsagePerUser: undefined,
      limitPeriod: "lifetime",
      cooldownPeriod: undefined,
      cooldownUnit: "hours",
      ...initialData
    }
  });

  const enableUserLimits = form.watch("enableUserLimits");

  const onSubmit = async (data: ProgramFormData) => {
    setIsCreating(true);
    try {
      // Create the program
      const response = await fetch("/api/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          purpose: data.purpose,
          inputType: data.inputType,
          expiryDays: data.expiryDays,
          minimumOrderValue: data.minimumOrderValue || null,
          fileFormatId: data.fileFormatId || null
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create program");
      }

      const program = await response.json();
      
      // Pass the program data and user limits to the next step
      onNext({
        ...data,
        programId: program.id
      });
    } catch (error) {
      console.error("Failed to create program:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Create Program</h2>
        <p className="text-gray-600">
          Create a reusable program template that defines wallet credit rules and user limits.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Program Details</h3>
                  <p className="text-sm text-gray-600">Define the basic program configuration</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Loyalty Program 2024" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiryDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Expiry (Days)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="30" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>Credits will expire after this many days</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the purpose of this program..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimumOrderValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Order Value (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormDescription>Minimum order value required to use credits</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">User Limits</h3>
                  <p className="text-sm text-gray-600">Set limits that apply across all campaigns using this program</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="enableUserLimits"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable User Limits</FormLabel>
                      <FormDescription>
                        Set usage limits per user across all campaigns using this program
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {enableUserLimits && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="maxUsagePerUser"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Usage Per User</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="5"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                            />
                          </FormControl>
                          <FormDescription>Maximum times a user can benefit</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="limitPeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Limit Period</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="day">Per Day</SelectItem>
                              <SelectItem value="week">Per Week</SelectItem>
                              <SelectItem value="month">Per Month</SelectItem>
                              <SelectItem value="lifetime">Lifetime</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cooldownPeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cooldown Period (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="24"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                            />
                          </FormControl>
                          <FormDescription>Wait time between usage</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cooldownUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cooldown Unit</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="hours">Hours</SelectItem>
                              <SelectItem value="days">Days</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating Program..." : "Create Program & Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}