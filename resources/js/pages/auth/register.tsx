import { Form, Head } from "@inertiajs/react";
import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import { store } from "@/routes/register";

type Props = { passwordRules: string };

export default function Register({ passwordRules }: Props) {
    return (
        <Form {...store.form()} resetOnSuccess={["password","password_confirmation"]} className="flex flex-col gap-6">
            <Head title="Registrar Usuario" />

            {({ errors }: any) => (
                <div className="grid gap-5">
                    <div className="grid gap-1.5">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre completo</label>
                        <input id="name" type="text" name="name" required autoFocus autoComplete="name" placeholder="Jose Munoz" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#001e38] dark:focus:border-[#dcc355] focus:ring-2 focus:ring-[#001e38]/10" />
                        <InputError message={errors.name} />
                    </div>
                    <div className="grid gap-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Correo electronico</label>
                        <input id="email" type="email" name="email" required autoComplete="email" placeholder="admin@agora.test" className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[#001e38] dark:focus:border-[#dcc355] focus:ring-2 focus:ring-[#001e38]/10" />
                        <InputError message={errors.email} />
                    </div>
                    <div className="grid gap-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Contrasena</label>
                        <PasswordInput id="password" name="password" required autoComplete="new-password" placeholder="Minimo 8 caracteres" passwordrules={passwordRules} />
                        <InputError message={errors.password} />
                    </div>
                    <div className="grid gap-1.5">
                        <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar contrasena</label>
                        <PasswordInput id="password_confirmation" name="password_confirmation" required autoComplete="new-password" placeholder="Repite la contrasena" passwordrules={passwordRules} />
                        <InputError message={errors.password_confirmation} />
                    </div>
                    <button type="submit" className="w-full rounded-lg bg-[#001e38] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#002d54] dark:bg-[#dcc355] dark:text-[#001e38] dark:hover:bg-[#c4a830]">
                        Crear cuenta
                    </button>
                </div>
            )}
        </Form>
    );
}