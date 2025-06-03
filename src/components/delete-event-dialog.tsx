"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
    const t = useTranslations("deleteEvent");
    const common = useTranslations("common");

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
                {t("button")}
            </Button>
        );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{triggerButton}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogDescription>
                        {t("description", { eventTitle })}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {storiesCount > 0 && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>{common("warning")}:</strong>{" "}
                                {t("warningMessage", { count: storiesCount })}
                            </p>
                        </div>
                    )}

                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                            <strong>{t("permanentWarning")}</strong>
                        </p>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isDeleting}
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t("deleting")}
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("deletePermanently")}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
