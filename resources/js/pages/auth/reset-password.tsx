import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';

type Props = { token: string; email: string; passwordRules: string };

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <Form
            action="/reset-password"
            method="post"
            className="flex flex-col gap-6"
        >
            <Head title="Restablecer Contrasena" />
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="email" value={email} />

            {({ errors }: any) => (
                <div className="grid gap-5">
                    <div className="grid gap-1.5">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Nueva contrasena
                        </label>
                        <PasswordInput
                            id="password"
                            name="password"
                            required
                            autoFocus
                            autoComplete="new-password"
                            placeholder="Minimo 8 caracteres"
                            passwordrules={passwordRules}
                        />
                        <InputError message={errors.password} />
                    </div>
                    <div className="grid gap-1.5">
                        <label
                            htmlFor="password_confirmation"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Confirmar contrasena
                        </label>
                        <PasswordInput
                            id="password_confirmation"
                            name="password_confirmation"
                            required
                            autoComplete="new-password"
                            placeholder="Repite la contrasena"
                            passwordrules={passwordRules}
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-[#001e38] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#002d54] dark:bg-[#dcc355] dark:text-[#001e38] dark:hover:bg-[#c4a830]"
                    >
                        Restablecer contrasena
                    </button>
                </div>
            )}
        </Form>
    );
}
