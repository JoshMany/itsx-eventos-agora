import { Button, Label, Modal } from '@heroui/react';
import { Form } from '@inertiajs/react';
import { useRef, useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-6">
            <Heading
                variant="small"
                title="Delete account"
                description="Delete your account and all of its resources"
            />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">Warning</p>
                    <p className="text-sm">
                        Please proceed with caution, this cannot be undone.
                    </p>
                </div>

                <Button
                    variant="danger"
                    onPress={() => setIsOpen(true)}
                    data-test="delete-user-button"
                >
                    Delete account
                </Button>

                <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
                    <Modal.Backdrop>
                        <Modal.Container>
                            <Modal.Dialog>
                                <Modal.Header>
                                    <Modal.Heading>
                                        Are you sure you want to delete your
                                        account?
                                    </Modal.Heading>
                                </Modal.Header>
                                <Modal.Body>
                                    <p className="text-sm text-muted-foreground">
                                        Once your account is deleted, all of its
                                        resources and data will also be
                                        permanently deleted. Please enter your
                                        password to confirm you would like to
                                        permanently delete your account.
                                    </p>

                                    <Form
                                        {...ProfileController.destroy.form()}
                                        options={{
                                            preserveScroll: true,
                                        }}
                                        onError={() =>
                                            passwordInput.current?.focus()
                                        }
                                        resetOnSuccess
                                        className="space-y-6"
                                    >
                                        {({
                                            resetAndClearErrors,
                                            processing,
                                            errors,
                                        }) => (
                                            <>
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor="password"
                                                        className="sr-only"
                                                    >
                                                        Password
                                                    </Label>

                                                    <PasswordInput
                                                        id="password"
                                                        name="password"
                                                        ref={passwordInput}
                                                        placeholder="Password"
                                                        autoComplete="current-password"
                                                    />

                                                    <InputError
                                                        message={
                                                            errors.password
                                                        }
                                                    />
                                                </div>

                                                <Modal.Footer className="gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        onPress={() => {
                                                            resetAndClearErrors();
                                                            setIsOpen(false);
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>

                                                    <Button
                                                        variant="danger"
                                                        isDisabled={processing}
                                                        type="submit"
                                                        data-test="confirm-delete-user-button"
                                                    >
                                                        Delete account
                                                    </Button>
                                                </Modal.Footer>
                                            </>
                                        )}
                                    </Form>
                                </Modal.Body>
                            </Modal.Dialog>
                        </Modal.Container>
                    </Modal.Backdrop>
                </Modal>
            </div>
        </div>
    );
}
