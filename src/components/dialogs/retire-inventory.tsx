import { Archive, ArchiveIcon } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

export function AlertDialogRetire({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon-sm" 
          className="text-muted-foreground hover:text-amber-600 hover:bg-amber-50 transition-colors rounded-full"
        >
          <Archive className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-amber-600">
            <ArchiveIcon className="w-5 h-5" />
            <AlertDialogTitle>Retire equipment?</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            This will mark the equipment as retired. It will still be in the system but not available for check-out. View{" "}
            <Link href="/settings" className="underline underline-offset-4">Settings</Link>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>{children}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
