"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Eye, Plus, X } from "lucide-react";
import { StoryStatus } from "@prisma/client";
import { updateStoryStatus, updateStoryTags } from "./actions";

interface Story {
    id: string;
    title: string;
    status: StoryStatus;
    tags: string[];
}

interface ReviewFormProps {
    story: Story;
}

export function ReviewForm({ story }: ReviewFormProps) {
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [isUpdatingTags, setIsUpdatingTags] = useState(false);
    const [tags, setTags] = useState<string[]>(story.tags);
    const [newTag, setNewTag] = useState("");

    const handleStatusUpdate = async (status: StoryStatus) => {
        setIsUpdatingStatus(true);
        try {
            await updateStoryStatus(story.id, status);
        } catch (error) {
            console.error("Error updating status:", error);
            // You could add toast notifications here
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleAddTag = () => {
        const trimmedTag = newTag.trim();
        if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
            setTags([...tags, trimmedTag]);
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleTagsUpdate = async () => {
        setIsUpdatingTags(true);
        try {
            await updateStoryTags(story.id, tags);
        } catch (error) {
            console.error("Error updating tags:", error);
            // You could add toast notifications here
        } finally {
            setIsUpdatingTags(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    return (
        <>
            {/* Status Update */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Update Status</CardTitle>
                    <CardDescription>
                        Change the review status of this story
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">
                                Current Status:
                            </span>
                            <Badge
                                variant={
                                    story.status === StoryStatus.APPROVED
                                        ? "default"
                                        : story.status === StoryStatus.REJECTED
                                        ? "destructive"
                                        : story.status === StoryStatus.READ
                                        ? "secondary"
                                        : "outline"
                                }
                                className={
                                    story.status === StoryStatus.PENDING_REVIEW
                                        ? "text-yellow-600 border-yellow-300"
                                        : story.status === StoryStatus.APPROVED
                                        ? "bg-green-600"
                                        : ""
                                }
                            >
                                {story.status === StoryStatus.PENDING_REVIEW &&
                                    "Pending Review"}
                                {story.status === StoryStatus.APPROVED &&
                                    "Approved"}
                                {story.status === StoryStatus.REJECTED &&
                                    "Rejected"}
                                {story.status === StoryStatus.READ && "Read"}
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            <Label>Change Status</Label>
                            <div className="grid grid-cols-1 gap-2">
                                <Button
                                    variant={
                                        story.status === StoryStatus.APPROVED
                                            ? "default"
                                            : "outline"
                                    }
                                    className="justify-start"
                                    onClick={() =>
                                        handleStatusUpdate(StoryStatus.APPROVED)
                                    }
                                    disabled={
                                        isUpdatingStatus ||
                                        story.status === StoryStatus.APPROVED
                                    }
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve Story
                                </Button>
                                <Button
                                    variant={
                                        story.status === StoryStatus.REJECTED
                                            ? "destructive"
                                            : "outline"
                                    }
                                    className="justify-start"
                                    onClick={() =>
                                        handleStatusUpdate(StoryStatus.REJECTED)
                                    }
                                    disabled={
                                        isUpdatingStatus ||
                                        story.status === StoryStatus.REJECTED
                                    }
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject Story
                                </Button>
                                <Button
                                    variant={
                                        story.status === StoryStatus.READ
                                            ? "secondary"
                                            : "outline"
                                    }
                                    className="justify-start"
                                    onClick={() =>
                                        handleStatusUpdate(StoryStatus.READ)
                                    }
                                    disabled={
                                        isUpdatingStatus ||
                                        story.status === StoryStatus.READ
                                    }
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Mark as Read
                                </Button>
                                <Button
                                    variant={
                                        story.status ===
                                        StoryStatus.PENDING_REVIEW
                                            ? "outline"
                                            : "outline"
                                    }
                                    className="justify-start"
                                    onClick={() =>
                                        handleStatusUpdate(
                                            StoryStatus.PENDING_REVIEW
                                        )
                                    }
                                    disabled={
                                        isUpdatingStatus ||
                                        story.status ===
                                            StoryStatus.PENDING_REVIEW
                                    }
                                >
                                    Reset to Pending
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tags Management */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Manage Tags</CardTitle>
                    <CardDescription>
                        Add or remove tags to categorize this story
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Current Tags */}
                        <div className="space-y-2">
                            <Label>Current Tags</Label>
                            <div className="flex flex-wrap gap-2">
                                {tags.length > 0 ? (
                                    tags.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="pl-2 pr-1"
                                        >
                                            {tag}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="ml-1 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                                onClick={() =>
                                                    handleRemoveTag(tag)
                                                }
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-muted-foreground text-sm">
                                        No tags added
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Add New Tag */}
                        <div className="space-y-2">
                            <Label htmlFor="newTag">Add New Tag</Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="newTag"
                                    placeholder="Enter tag name"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={tags.length >= 10}
                                    maxLength={30}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddTag}
                                    disabled={
                                        !newTag.trim() ||
                                        tags.includes(newTag.trim()) ||
                                        tags.length >= 10
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            {tags.length >= 10 && (
                                <p className="text-xs text-muted-foreground">
                                    Maximum 10 tags allowed
                                </p>
                            )}
                        </div>

                        {/* Save Tags */}
                        <Button
                            onClick={handleTagsUpdate}
                            disabled={
                                isUpdatingTags ||
                                JSON.stringify(tags) ===
                                    JSON.stringify(story.tags)
                            }
                            className="w-full"
                        >
                            {isUpdatingTags ? "Saving..." : "Save Tags"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
