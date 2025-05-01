import { UUID } from "node:crypto";

export type User = {
    id: UUID;
    name: string;
    email: string;
    passwordHash: string;

    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}