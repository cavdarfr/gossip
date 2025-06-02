"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createEvent } from "./actions";

export function CreateEventDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations("dashboard.createEvent");
    const common = useTranslations("common");

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            await createEvent(formData);
            setOpen(false);
        } catch (error) {
            console.error("Error creating event:", error);
            // You could add toast notifications here
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("button")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogDescription>{t("description")}</DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">{t("form.eventTitle")}</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder={t("form.eventTitlePlaceholder")}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            {t("form.description")}
                        </Label>
                        <Input
                            id="description"
                            name="description"
                            placeholder={t("form.descriptionPlaceholder")}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            {common("cancel")}
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading
                                ? t("form.creating")
                                : t("form.createEvent")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
