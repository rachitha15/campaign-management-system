import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Program {
  id: string;
  name: string;
  purpose: "promotions" | "loyalty";
  inputType: "event" | "file";
  expiryDays: number;
  minimumOrderValue?: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export default function ProgramsList() {
  const { toast } = useToast();
  
  const { data: programs = [], isLoading } = useQuery<Program[]>({
    queryKey: ['/api/programs'],
  });

  const deleteProgramMutation = useMutation({
    mutationFn: async (programId: string) => {
      return apiRequest('DELETE', `/api/programs/${programId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/programs'] });
      toast({
        title: "Success",
        description: "Program deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete program",
        variant: "destructive",
      });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ programId, status }: { programId: string; status: string }) => {
      return apiRequest('PUT', `/api/programs/${programId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/programs'] });
      toast({
        title: "Success",
        description: "Program status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update program status",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (programId: string) => {
    if (confirm("Are you sure you want to delete this program?")) {
      deleteProgramMutation.mutate(programId);
    }
  };

  const handleToggleStatus = (programId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    toggleStatusMutation.mutate({ programId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">All Programs</h2>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Program ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Input Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expiry Days</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No programs found. Create your first program with the "New Program" button.
              </TableCell>
            </TableRow>
          ) : (
            programs.map((program) => (
              <TableRow key={program.id}>
                <TableCell className="font-mono text-sm">
                  {program.id}
                </TableCell>
                <TableCell className="font-medium">
                  {program.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {program.purpose}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {program.inputType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={program.status === "active" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {program.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {program.expiryDays} days
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleStatus(program.id, program.status)}
                      >
                        {program.status === "active" ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(program.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}