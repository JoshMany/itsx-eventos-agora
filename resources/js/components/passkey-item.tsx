import { KeyRound, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button, Modal } from '@heroui/react';
import type { Passkey } from '@/types/auth';

type Props = {
    passkey: Passkey;
    onDelete: (id: number, onError: () => void) => void;
};

export default function PasskeyItem({ passkey, onDelete }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        onDelete(passkey.id, () => setIsDeleting(false));
    };

    return (
        <div className="flex items-center justify-between border-b p-4 last:border-b-0">
            <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <KeyRound className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                        <p className="font-medium tracking-tight">
                            {passkey.name}
                        </p>
                        {passkey.authenticator && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase ring-1 ring-border ring-inset">
                                {passkey.authenticator}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Added {passkey.created_at_diff}
                        {passkey.last_used_at_diff && (
                            <>
                                <span className="mx-1 text-muted-foreground/50">
                                    /
                                </span>
                                Last used {passkey.last_used_at_diff}
                            </>
                        )}
                    </p>
                </div>
            </div>

            <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onPress={() => setIsOpen(true)}
            >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
            </Button>

            <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
                <Modal.Backdrop>
                    <Modal.Container>
                        <Modal.Dialog>
                            <Modal.Header>
                                <Modal.Heading>Remove passkey</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body>
                                <p className="text-sm text-muted-foreground">
                                    Are you sure you want to remove the "
                                    {passkey.name}" passkey? You will no longer
                                    be able to use it to sign in.
                                </p>
                            </Modal.Body>
                            <Modal.Footer className="gap-2">
                                <Button
                                    variant="secondary"
                                    onPress={() => setIsOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    onPress={handleDelete}
                                    isDisabled={isDeleting}
                                >
                                    {isDeleting
                                        ? 'Removing...'
                                        : 'Remove passkey'}
                                </Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    );
}
