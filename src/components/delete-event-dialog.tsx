"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Loader2 } from "lucide-react";
import { deleteEvent } from "@/app/[locale]/dashboard/actions";

interface DeleteEventDialogProps {
    eventId: string;
    eventTitle: string;
    storiesCount?: number;
    variant?: "button" | "icon";
    size?: "sm" | "default";
    onDeleted?: () => void;
}

export function DeleteEventDialog({
    eventId,
    eventTitle,
    storiesCount = 0,
    variant = "button",
    size = "sm",
    onDeleted,
}: DeleteEventDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteEvent(eventId);
            setIsOpen(false);
            if (onDeleted) {
                onDeleted();
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const triggerButton =
        variant === "icon" ? (
            <Button variant="ghost" size={size}>
                <Trash2 className="h-4 w-4" />
            </Button>
        ) : (
            <Button variant="destructive" size={size}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Event
            </Button>
        );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{triggerButton}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Event</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete &quot;{eventTitle}
                        &quot;?
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {storiesCount > 0 && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>Warning:</strong> This event has{" "}
                                {storiesCount}{" "}
                                {storiesCount === 1 ? "story" : "stories"}. All
                                stories will be permanently deleted along with
                                the event.
                            </p>
                        </div>
                    )}

                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                            <strong>This action cannot be undone.</strong> All
                            data associated with this event will be permanently
                            lost.
                        </p>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Permanently
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
