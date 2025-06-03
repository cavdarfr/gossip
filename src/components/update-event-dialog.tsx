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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Loader2 } from "lucide-react";
import { updateEvent } from "@/app/[locale]/dashboard/actions";

interface Event {
    id: string;
    title: string;
    description: string;
    isActive: boolean;
}

interface UpdateEventDialogProps {
    event: Event;
    variant?: "button" | "icon";
    size?: "sm" | "default";
}

export function UpdateEventDialog({
    event,
    variant = "button",
    size = "sm",
}: UpdateEventDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState({
        title: event.title,
        description: event.description,
        isActive: event.isActive,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const t = useTranslations("updateEvent");
    const common = useTranslations("common");

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleActiveChange = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, isActive: checked }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = t("form.eventTitleRequired");
        }
        if (!formData.description.trim()) {
            newErrors.description = t("form.descriptionRequired");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsUpdating(true);
        try {
            const formDataObj = new FormData();
            formDataObj.append("title", formData.title);
            formDataObj.append("description", formData.description);
            formDataObj.append("isActive", formData.isActive.toString());

            await updateEvent(event.id, formDataObj);
            setIsOpen(false);
        } catch (error) {
            console.error("Error updating event:", error);
            setErrors({ submit: t("form.submitError") });
        } finally {
            setIsUpdating(false);
        }
    };

    const triggerButton =
        variant === "icon" ? (
            <Button variant="ghost" size={size}>
                <Edit2 className="h-4 w-4" />
            </Button>
        ) : (
            <Button variant="outline" size={size}>
                <Edit2 className="mr-2 h-4 w-4" />
                {t("button")}
            </Button>
        );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{triggerButton}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogDescription>{t("description")}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Event Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            {t("form.eventTitle")}{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder={t("form.eventTitlePlaceholder")}
                            value={formData.title}
                            onChange={handleInputChange}
                            className={errors.title ? "border-red-500" : ""}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Event Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            {t("form.description")}{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder={t("form.descriptionPlaceholder")}
                            value={formData.description}
                            onChange={handleInputChange}
                            className={`min-h-[100px] ${
                                errors.description ? "border-red-500" : ""
                            }`}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={handleActiveChange}
                        />
                        <Label
                            htmlFor="isActive"
                            className="text-sm font-medium"
                        >
                            {t("form.isActive")}
                        </Label>
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <p className="text-sm text-red-500">{errors.submit}</p>
                    )}

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isUpdating}
                        >
                            {common("cancel")}
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t("form.updating")}
                                </>
                            ) : (
                                <>
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    {t("form.updateEvent")}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
