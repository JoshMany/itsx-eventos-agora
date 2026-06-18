import { Alert } from '@heroui/react';
import { AlertCircleIcon } from 'lucide-react';

export default function AlertError({
    errors,
    title,
}: {
    errors: string[];
    title?: string;
}) {
    return (
        <Alert color="danger" title={title || 'Something went wrong.'}>
            <AlertCircleIcon className="size-4" />
            <ul className="list-inside list-disc text-sm">
                {Array.from(new Set(errors)).map((error, index) => (
                    <li key={index}>{error}</li>
                ))}
            </ul>
        </Alert>
    );
}
