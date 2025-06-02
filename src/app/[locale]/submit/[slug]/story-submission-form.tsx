"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2, Plus, X } from "lucide-react";
import { submitStory } from "./actions";

interface StorySubmissionFormProps {
    eventId: string;
}

export function StorySubmissionForm({ eventId }: StorySubmissionFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        submitterEmail: "",
        submitterUsername: "",
        title: "",
        content: "",
        anonymous: false,
        tags: [] as string[],
    });
    const [newTag, setNewTag] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const t = useTranslations("submit.form");
    const success = useTranslations("submit.success");

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

    const handleAnonymousChange = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, anonymous: checked }));
    };

    const handleAddTag = () => {
        const trimmedTag = newTag.trim();
        if (
            trimmedTag &&
            !formData.tags.includes(trimmedTag) &&
            formData.tags.length < 10
        ) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, trimmedTag],
            }));
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.anonymous && !formData.submitterEmail.trim()) {
            newErrors.submitterEmail = t("emailRequired");
        }
        if (!formData.anonymous && !formData.submitterUsername.trim()) {
            newErrors.submitterUsername = t("usernameRequired");
        }
        if (
            formData.submitterEmail &&
            !/\S+@\S+\.\S+/.test(formData.submitterEmail)
        ) {
            newErrors.submitterEmail = t("emailInvalid");
        }
        if (!formData.title.trim()) {
            newErrors.title = t("storyTitleRequired");
        }
        if (!formData.content.trim()) {
            newErrors.content = t("storyContentRequired");
        }
        if (formData.content.length > 10000) {
            newErrors.content = t("storyContentTooLong");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await submitStory({
                eventId,
                submitterEmail: formData.anonymous
                    ? ""
                    : formData.submitterEmail,
                submitterUsername: formData.anonymous
                    ? ""
                    : formData.submitterUsername,
                title: formData.title,
                content: formData.content,
                anonymous: formData.anonymous,
                tags: formData.tags,
            });

            setIsSubmitted(true);
        } catch (error) {
            console.error("Error submitting story:", error);
            setErrors({ submit: t("submitError") });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                        <div>
                            <h3 className="text-lg font-semibold">
                                {success("title")}
                            </h3>
                            <p className="text-muted-foreground">
                                {success("description")}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsSubmitted(false);
                                setFormData({
                                    submitterEmail: "",
                                    submitterUsername: "",
                                    title: "",
                                    content: "",
                                    anonymous: false,
                                    tags: [],
                                });
                            }}
                        >
                            {success("submitAnother")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Anonymous Toggle */}
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="anonymous"
                    checked={formData.anonymous}
                    onCheckedChange={handleAnonymousChange}
                />
                <Label htmlFor="anonymous" className="text-sm font-medium">
                    {t("anonymous")}
                </Label>
            </div>

            {/* Submitter Information */}
            {!formData.anonymous && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="submitterEmail">
                            {t("email")} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="submitterEmail"
                            name="submitterEmail"
                            type="email"
                            value={formData.submitterEmail}
                            onChange={handleInputChange}
                            className={
                                errors.submitterEmail ? "border-red-500" : ""
                            }
                        />
                        {errors.submitterEmail && (
                            <p className="text-sm text-red-500">
                                {errors.submitterEmail}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="submitterUsername">
                            {t("username")}{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="submitterUsername"
                            name="submitterUsername"
                            value={formData.submitterUsername}
                            onChange={handleInputChange}
                            className={
                                errors.submitterUsername ? "border-red-500" : ""
                            }
                        />
                        {errors.submitterUsername && (
                            <p className="text-sm text-red-500">
                                {errors.submitterUsername}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Story Title */}
            <div className="space-y-2">
                <Label htmlFor="title">
                    {t("storyTitle")} <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder={t("storyTitlePlaceholder")}
                    className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                )}
            </div>

            {/* Story Content */}
            <div className="space-y-2">
                <Label htmlFor="content">
                    {t("storyContent")} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder={t("storyContentPlaceholder")}
                    className={`min-h-[200px] ${
                        errors.content ? "border-red-500" : ""
                    }`}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                        {formData.content.length > 10000 && (
                            <span className="text-red-500">
                                {t("storyContentTooLong")}
                            </span>
                        )}
                    </span>
                    <span>{formData.content.length}/10,000</span>
                </div>
                {errors.content && (
                    <p className="text-sm text-red-500">{errors.content}</p>
                )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
                <Label htmlFor="newTag">{t("tags")}</Label>
                <div className="flex space-x-2">
                    <Input
                        id="newTag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t("tagsPlaceholder")}
                        disabled={formData.tags.length >= 10}
                    />
                    <Button
                        type="button"
                        onClick={handleAddTag}
                        disabled={!newTag.trim() || formData.tags.length >= 10}
                        size="sm"
                    >
                        <Plus className="h-4 w-4" />
                        {t("addTag")}
                    </Button>
                </div>
                {formData.tags.length >= 10 && (
                    <p className="text-sm text-muted-foreground">
                        {t("maxTags")}
                    </p>
                )}
                <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center space-x-1"
                        >
                            <span>{tag}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 hover:text-red-500"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
                <p className="text-sm text-red-500">{errors.submit}</p>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("submitting")}
                    </>
                ) : (
                    t("submitStory")
                )}
            </Button>
        </form>
    );
}
