"use client";

import { useState } from "react";
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
            newErrors.submitterEmail =
                "Email is required for non-anonymous submissions";
        }
        if (!formData.anonymous && !formData.submitterUsername.trim()) {
            newErrors.submitterUsername =
                "Username is required for non-anonymous submissions";
        }
        if (
            formData.submitterEmail &&
            !/\S+@\S+\.\S+/.test(formData.submitterEmail)
        ) {
            newErrors.submitterEmail = "Please enter a valid email address";
        }
        if (!formData.title.trim()) {
            newErrors.title = "Story title is required";
        }
        if (!formData.content.trim()) {
            newErrors.content = "Story content is required";
        }
        if (formData.content.length > 10000) {
            newErrors.content =
                "Story content must be less than 10,000 characters";
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
            setErrors({ submit: "Failed to submit story. Please try again." });
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
                                Story Submitted Successfully!
                            </h3>
                            <p className="text-muted-foreground">
                                Thank you for sharing your story. It will be
                                reviewed and may be featured soon.
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
                            Submit Another Story
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
                    Submit anonymously
                </Label>
            </div>

            {/* Submitter Information */}
            {!formData.anonymous && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="submitterEmail">
                            Email Address{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="submitterEmail"
                            name="submitterEmail"
                            type="email"
                            placeholder="your.email@example.com"
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
                            Display Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="submitterUsername"
                            name="submitterUsername"
                            placeholder="Your name or handle"
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
                    Story Title <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="title"
                    name="title"
                    placeholder="Give your story a compelling title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                )}
            </div>

            {/* Story Content */}
            <div className="space-y-2">
                <Label htmlFor="content">
                    Your Story <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    id="content"
                    name="content"
                    placeholder="Share your story, experience, or thoughts..."
                    value={formData.content}
                    onChange={handleInputChange}
                    className={`min-h-[200px] ${
                        errors.content ? "border-red-500" : ""
                    }`}
                    maxLength={10000}
                />
                <div className="flex justify-between items-center">
                    {errors.content && (
                        <p className="text-sm text-red-500">{errors.content}</p>
                    )}
                    <p className="text-sm text-muted-foreground ml-auto">
                        {formData.content.length}/10,000 characters
                    </p>
                </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
                <Label>Tags (Optional)</Label>
                <p className="text-sm text-muted-foreground">
                    Add tags to help categorize your story
                </p>

                {/* Current Tags */}
                <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                        <Badge
                            key={index}
                            variant="outline"
                            className="pl-2 pr-1"
                        >
                            {tag}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="ml-1 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => handleRemoveTag(tag)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>

                {/* Add New Tag */}
                <div className="flex space-x-2">
                    <Input
                        placeholder="Add a tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={formData.tags.length >= 10}
                        maxLength={30}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddTag}
                        disabled={
                            !newTag.trim() ||
                            formData.tags.includes(newTag.trim()) ||
                            formData.tags.length >= 10
                        }
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                {formData.tags.length >= 10 && (
                    <p className="text-xs text-muted-foreground">
                        Maximum 10 tags allowed
                    </p>
                )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
                <p className="text-sm text-red-500">{errors.submit}</p>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    "Submit Story"
                )}
            </Button>
        </form>
    );
}
